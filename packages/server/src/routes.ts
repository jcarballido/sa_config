import type { FastifyInstance } from 'fastify'
import { and, asc, eq } from 'drizzle-orm'
// import { db } from './db.js'
import { assets } from './schema.js'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
export async function registerRoutes(app: FastifyInstance) {
  app.get("/test",async(request,reply) => {
  const S3 = new S3Client({
    region: "auto",
    endpoint:process.env.R2_ENDPOINT!,
    credentials:{
      accessKeyId:process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey:process.env.R2_SECRET_ACCESS_KEY!
    }
  })
  console.log(
    await getSignedUrl(
      S3,
      new GetObjectCommand({ Bucket: "products", Key: "small/cad/SADIA17-B-CC.glb" }),
      { expiresIn: 3600 },
    ),
  );
  })

  // app.get('/api/assets', async (request, reply) => {
  //   const type = (request.query as { type?: string }).type
  //   const rows = await db
  //     .select({
  //       id: assets.id,
  //       name: assets.name,
  //       type: assets.type,
  //       format: assets.format,
  //       mime: assets.mime,
  //       size: assets.size,
  //       width: assets.width,
  //       height: assets.height,
  //       createdAt: assets.createdAt,
  //     })
  //     .from(assets)
  //     .where(type ? eq(assets.type, type) : undefined)
  //     .orderBy(asc(assets.createdAt))
  //   return reply.send({ assets: rows })
  // })

  // app.get('/api/assets/:id', async (request, reply) => {
  //   const { id } = request.params as { id: string }
  //   const rows = await db.select().from(assets).where(eq(assets.id, id)).limit(1)
  //   if (rows.length === 0) return reply.code(404).send({ error: 'asset not found' })
  //   return reply.send(rows[0])
  // })

  // app.get('/api/assets/:id/file', async (request, reply) => {
  //   const { id } = request.params as { id: string }
  //   const rows = await db.select().from(assets).where(eq(assets.id, id)).limit(1)
  //   if (rows.length === 0) return reply.code(404).send({ error: 'asset not found' })

  //   const asset = rows[0]
  //   reply.header('Cache-Control', 'public, max-age=3600')
  //   try {
  //     return await reply.sendFile(`${asset.id}.${asset.format}`)
  //   } catch {
  //     return reply.code(404).send({ error: 'file missing on disk' })
  //   }
  // })

  return app
}
