import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { deflateSync } from 'node:zlib'
import { resolve } from 'node:path'
import { eq } from 'drizzle-orm'
import { db } from './db.js'
import { assets, type NewAsset } from './schema.js'

export const storageDir = resolve(import.meta.dirname, '..', 'storage')

const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

function crc32(buf: Buffer): number {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crc])
}

function generateGradientPng(width: number, height: number): Buffer {
  const raw = Buffer.alloc(height * (1 + width * 3))
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3)
    raw[rowStart] = 0
    for (let x = 0; x < width; x++) {
      const p = rowStart + 1 + x * 3
      raw[p] = Math.round((x / width) * 255)
      raw[p + 1] = Math.round((y / height) * 255)
      raw[p + 2] = 128
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  return Buffer.concat([
    PNG_SIG,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

const CUBE_VERTS: number[] = [
  -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
  -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
]

const CUBE_INDICES: number[] = [
  0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6, 1, 5, 2, 5, 6, 2,
  0, 3, 4, 3, 7, 4, 3, 2, 7, 2, 6, 7, 0, 4, 1, 4, 5, 1,
]

function generateCubeGlb(): Buffer {
  const posBuf = Buffer.alloc(CUBE_VERTS.length * 4)
  CUBE_VERTS.forEach((v, i) => posBuf.writeFloatLE(v, i * 4))
  const idxBuf = Buffer.alloc(CUBE_INDICES.length * 2)
  CUBE_INDICES.forEach((v, i) => idxBuf.writeUInt16LE(v, i * 2))

  const buffer = Buffer.concat([posBuf, idxBuf])
  const json = {
    asset: { version: '2.0' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [
      {
        primitives: [
          {
            attributes: { POSITION: 0 },
            indices: 1,
            material: 0,
          },
        ],
      },
    ],
    materials: [
      {
        pbrMetallicRoughness: { baseColorFactor: [0.85, 0.55, 0.25, 1] },
      },
    ],
    buffers: [
      {
        byteLength: buffer.length,
        uri: `data:application/octet-stream;base64,${buffer.toString('base64')}`,
      },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: posBuf.length, target: 34962 },
      { buffer: 0, byteOffset: posBuf.length, byteLength: idxBuf.length, target: 34963 },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: 8,
        type: 'VEC3',
        min: [-1, -1, -1],
        max: [1, 1, 1],
      },
      { bufferView: 1, componentType: 5123, count: 36, type: 'SCALAR' },
    ],
  }

  const jsonBuf = Buffer.from(JSON.stringify(json), 'utf8')
  const paddedLen = Math.ceil(jsonBuf.length / 4) * 4
  const padded = Buffer.alloc(paddedLen)
  jsonBuf.copy(padded)
  padded.fill(0x20, jsonBuf.length)

  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(12 + 8 + paddedLen, 8)

  const chunkHeader = Buffer.alloc(8)
  chunkHeader.writeUInt32LE(paddedLen, 0)
  chunkHeader.write('JSON', 4, 'ascii')

  return Buffer.concat([header, chunkHeader, padded])
}

async function download(url: string, timeoutMs = 20_000): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

function pngSize(buf: Buffer): [number, number] | null {
  if (buf.length < 24 || !PNG_SIG.equals(buf.subarray(0, 8))) return null
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)]
}

type SeedAsset = {
  name: string
  type: 'image' | 'model'
  format: string
  mime: string
  width?: number | null
  height?: number | null
  get: () => Promise<Buffer>
}

const seeds: SeedAsset[] = [
  {
    name: 'high-res-gradient',
    type: 'image',
    format: 'png',
    mime: 'image/png',
    get: async () => {
      const dl = await download('https://picsum.photos/seed/sa-config/1600/1200.png')
      if (dl) return dl
      console.warn('  [image] download failed, using generated gradient PNG')
      return generateGradientPng(1600, 1200)
    },
  },
  {
    name: 'damaged-helmet',
    type: 'model',
    format: 'glb',
    mime: 'model/gltf-binary',
    get: async () => {
      const dl = await download(
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
      )
      if (dl) return dl
      console.warn('  [model] download failed, using generated cube GLB')
      return generateCubeGlb()
    },
  },
]

async function main() {
  await mkdir(storageDir, { recursive: true })

  for (const seed of seeds) {
    const existing = await db.select({ id: assets.id }).from(assets).where(eq(assets.name, seed.name)).limit(1)
    if (existing.length > 0) {
      console.log(`skip ${seed.name} (already seeded as ${existing[0].id})`)
      continue
    }

    process.stdout.write(`fetching ${seed.name}... `)
    const data = await seed.get()
    const id = randomUUID()
    const path = `${id}.${seed.format}`
    await writeFile(resolve(storageDir, path), data)

    let width = seed.width ?? null
    let height = seed.height ?? null
    if (seed.type === 'image' && width === null) {
      const size = pngSize(data)
      width = size?.[0] ?? null
      height = size?.[1] ?? null
    }

    const row: NewAsset = {
      id,
      name: seed.name,
      type: seed.type,
      format: seed.format,
      mime: seed.mime,
      size: data.length,
      path,
      width,
      height,
    }
    await db.insert(assets).values(row)
    console.log(`stored ${(data.length / 1024).toFixed(1)} KiB -> ${path}`)
  }

  const count = await db.$count(assets)
  console.log(`done. ${count} assets in db, files in ${storageDir}`)
  await db.$client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
