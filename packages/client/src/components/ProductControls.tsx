import { useState } from 'react'
import type { Product } from '../viewerConfig'
import OptionRow from '../features/configMenu/OptionRow'
import { useAppStore } from '../stores/app.store'
import type { Assets } from '../api/types'

type ProductControlsProps = {
  // products: Product[]
  // productId: string
  // onProductChange: (id: string) => void
  // variantIndex: number
  // onVariantChange: (index: number) => void
  // kind: 'model' | 'image'
  // onKindChange: (kind: 'model' | 'image') => void
  // downloadUrl: string | null
}

// async function downloadFile(url: string, label: string): Promise<void> {
//   const res = await fetch(url)
//   if (!res.ok) throw new Error(`server responded ${res.status}`)
//   const blob = await res.blob()
//   const ext = url.split('?')[0].split('.').pop() ?? 'bin'
//   const objectUrl = URL.createObjectURL(blob)
//   const a = document.createElement('a')
//   a.href = objectUrl
//   a.download = `${label}.${ext}`
//   document.body.appendChild(a)
//   a.click()
//   a.remove()
//   URL.revokeObjectURL(objectUrl)
// }

// function OptionRow({
//   label,
//   selected,
//   onClick,
// }: {
//   label: string
//   selected: boolean
//   onClick: () => void
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex w-full items-center justify-between rounded-lg border  px-4 py-3 text-sm font-medium transition ${
//         selected
//           ? 'border-purple-500 bg-zinc-800 text-zinc-100'
//           : 'border-green-500 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'
//       }`}
//     >
//       <span>{label}</span>
//       <span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-600 text-[10px]">
//         {selected ? '✓' : ''}
//       </span>
//     </button>
//   )
// }

function SidebarHeader(){
  return(
  <div className="flex items-start justify-between border-b border-zinc-800 pb-5">
    <div>
      <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-500">Configuration</p>
      <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-zinc-100">PRODUCT NAME</h2>
    </div>
    {/* <span className="flex items-center gap-1.5 text-xs text-emerald-400">
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
      Live
    </span> */}
  </div>  
  )
  {/* Sidebar header */}
}

export function ProductControls({
  // products,
  // productId,
  // onProductChange,
  // variantIndex,
  // onVariantChange,
  // kind,
  // onKindChange,
  // downloadUrl,
}: ProductControlsProps) {
  // const [downloading, setDownloading] = useState(false)
  // const [downloadError, setDownloadError] = useState<string | null>(null)
  // const product = products.find((p) => p.id === productId) ?? products[0]
  const { assets } = useAppStore()
  const groups = new Map<string, Assets>()
  for(const asset of assets){
    const group = groups.get(asset.category)
    if(group){
      group.push(asset)
    }else{
      groups.set(asset.category,[asset])
    }
  }
  console.log("GROUPS:")
  console.log(Array.from(groups))
  const productId = 0
  const products = [{id:0,name:"One"},{id:1,name:"Two"},{id:3,name:"Three"}]
  const product = products.find((p) => p.id === productId) ?? products[0]

  // const activeVariant = product.variants[variantIndex] ?? product.variants[0]

  // const configIndex = `N04-${product.name.slice(0, 2).toUpperCase()}-${kind === 'model' ? '3D' : 'RN'}`

  async function handleDownload() {
    // if (!downloadUrl) return
    // setDownloading(true)
    // setDownloadError(null)
    // try {
    //   await downloadFile(downloadUrl, `${product.name} ${activeVariant.label}`)
    // } catch (err) {
    //   setDownloadError(String(err))
    // } finally {
    //   setDownloading(false)
    // }
  }

  return (
    <aside className="w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-5 lg:max-w-97.5 lg:p-6">
      <SidebarHeader />
      {/* Option groups */}
      <div className="flex flex-col gap-7 py-6">
          {
            Array.from(groups,([category, assets]) =>{
              return (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-semibold capitalize text-zinc-100">{category}</label>
                  </div>
                  <div className="flex flex-col gap-4 border">
                  {
                    assets.map((asset,index) => {
                      return (
                          <OptionRow key={index} label={category} />
                        )
                      })
                    }
                    </div>
                </div>
            )})
          }
        {/* Product group */}
        {/* <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold capitalize text-zinc-100">PRODUCT</label>
            <span className="font-mono text-[10px] text-zinc-500">UNKOWN</span>
          </div>
          <div className="flex flex-col gap-2">

            {products.map((p) => (
              <OptionRow
                key={p.id}
                label={p.name}
                // selected={p.id === productId}
                // onClick={() => onProductChange(p.id)}
              />
            ))}
          </div>
        </div> */}

        {/* Variant group */}
        {/* <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold capitalize text-zinc-100">variant</label>
            <span className="font-mono text-[10px] text-zinc-500">02 / 03</span>
          </div>
          <div className="flex flex-col gap-2"> */}
            {/* {product.variants.map((v, i) => (
              <OptionRow
                key={v.label}
                label={v.label}
                // selected={i === variantIndex}
                // onClick={() => onVariantChange(i)}
              />
            ))} */}
          {/* </div>
        </div> */}

        {/* Display group */}
        {/* <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold capitalize text-zinc-100">display</label>
            <span className="font-mono text-[10px] text-zinc-500">03 / 03</span>
          </div>
          <div className="flex flex-col gap-2"> */}
            {/* <OptionRow
              label="3D Model"
              selected={kind === 'model'}
              onClick={() => onKindChange('model')}
            />
            <OptionRow
              label="Rendered image"
              selected={kind === 'image'}
              onClick={() => onKindChange('image')}
            /> */}
          {/* </div>
        </div>*/}
      </div> 

      {/* Config index + download */}
      <div className="border-t border-zinc-800 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs text-zinc-500">Configuration index</span>
          {/* <span className="font-mono text-xs font-medium text-zinc-300">{configIndex}</span> */}
        </div>

        <button
        //  onClick={handleDownload}
          // disabled={!downloadUrl || downloading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <div className="h-4 w-4 rounded bg-zinc-600" />
          {/* {downloading ? 'Downloading…' : 'Download preloaded image'} */}
        </button>
        <p className="mt-3 text-center text-[11px] leading-5 text-zinc-500">
          Image download only. 3D source files are not downloadable.
        </p>

        {/* {downloadError && (
          <div className="mt-3 rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300">
            Download failed: {downloadError}
          </div>
        )} */}
      </div>
    </aside>
  )
}
