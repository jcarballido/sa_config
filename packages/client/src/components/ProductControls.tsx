import { useState } from 'react'
import type { Product } from '../viewerConfig'

type ProductControlsProps = {
  products: Product[]
  productId: string
  onProductChange: (id: string) => void
  variantIndex: number
  onVariantChange: (index: number) => void
  kind: 'model' | 'image'
  onKindChange: (kind: 'model' | 'image') => void
  color: string | null
  onColorChange: (color: string | null) => void
  downloadUrl: string | null
}

const SWATCHES: { name: string; value: string | null }[] = [
  { name: 'Original', value: null },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Amber', value: '#f59e0b' },
]

async function downloadFile(url: string, label: string): Promise<void> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`server responded ${res.status}`)
  const blob = await res.blob()
  const ext = url.split('?')[0].split('.').pop() ?? 'bin'
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = `${label}.${ext}`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(objectUrl)
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-zinc-400">
      <span>{label}</span>
      {children}
    </label>
  )
}

function Divider() {
  return <div className="h-px bg-zinc-800" />
}

export function ProductControls({
  products,
  productId,
  onProductChange,
  variantIndex,
  onVariantChange,
  kind,
  onKindChange,
  color,
  onColorChange,
  downloadUrl,
}: ProductControlsProps) {
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const product = products.find((p) => p.id === productId) ?? products[0]
  const activeVariant = product.variants[variantIndex] ?? product.variants[0]

  async function handleDownload() {
    if (!downloadUrl) return
    setDownloading(true)
    setDownloadError(null)
    try {
      await downloadFile(downloadUrl, `${product.name} ${activeVariant.label}`)
    } catch (err) {
      setDownloadError(String(err))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:w-72">
      <h2 className="text-sm font-medium text-zinc-300">{product.name}</h2>

      <Field label="Product">
        <select
          value={productId}
          onChange={(e) => onProductChange(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-200"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Variant">
        <select
          value={variantIndex}
          onChange={(e) => onVariantChange(Number(e.target.value))}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-200"
        >
          {product.variants.map((v, i) => (
            <option key={v.label} value={i}>
              {v.label}
            </option>
          ))}
        </select>
      </Field>

      <Divider />

      <Field label="Display">
        <div className="flex overflow-hidden rounded-lg border border-zinc-700 text-sm">
          <button
            onClick={() => onKindChange('model')}
            className={`flex-1 px-3 py-1.5 transition ${
              kind === 'model' ? 'bg-zinc-700 text-white' : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            3D Model
          </button>
          <button
            onClick={() => onKindChange('image')}
            className={`flex-1 px-3 py-1.5 transition ${
              kind === 'image' ? 'bg-zinc-700 text-white' : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            Render
          </button>
        </div>
      </Field>

      <Field label="Color">
        <div className="flex items-center gap-1.5">
          {SWATCHES.map((s) => (
            <button
              key={s.name}
              title={s.name}
              onClick={() => onColorChange(s.value)}
              className={`h-6 w-6 rounded-full border border-zinc-600 transition ${
                color === s.value ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-900' : 'hover:scale-110'
              }`}
              style={
                s.value
                  ? { backgroundColor: s.value }
                  : { background: 'linear-gradient(135deg, #fafafa 45%, #ef4444 45%, #ef4444 55%, #fafafa 55%)' }
              }
            />
          ))}
          <label
            title="Custom color"
            className="relative h-6 w-6 cursor-pointer overflow-hidden rounded-full border border-zinc-600"
            style={{ backgroundColor: color ?? '#ffffff' }}
          >
            <input
              type="color"
              value={color ?? '#ffffff'}
              onChange={(e) => onColorChange(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
      </Field>

      <Divider />

      <button
        onClick={handleDownload}
        disabled={!downloadUrl || downloading}
        className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {downloading ? 'Downloading…' : 'Download render'}
      </button>

      {downloadError && (
        <div className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300">
          Download failed: {downloadError}
        </div>
      )}
    </aside>
  )
}
