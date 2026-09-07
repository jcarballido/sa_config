import { useEffect, useState } from 'react'
import { ProductViewer } from './components/ProductViewer'
import { ProductControls } from './components/ProductControls'
import { Login } from './components/Login'
import { useAuthStore } from './stores/auth.store'
import { PRODUCTS } from './viewerConfig'
// import { getConfigurations } from './api/configurations.api'
import { useAppStore } from './stores/app.store'

export default function App() {
  const { authStatus } = useAuthStore()
  const { initialize, initialized } = useAppStore()
  const [productId, setProductId] = useState(PRODUCTS[0].id)
  const [variantIndex, setVariantIndex] = useState(0)
  const [kind, setKind] = useState<'model' | 'image'>('model')
  const [color, setColor] = useState<string | null>(null)
  const [pinged, setPinged] = useState<boolean>(false)

  const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0]
  const variant = product.variants[Math.min(variantIndex, product.variants.length - 1)]

  function handleProductChange(id: string) {
    setProductId(id)
    setVariantIndex(0)
    setColor(null)
  }

  function handleVariantChange(index: number) {
    setVariantIndex(index)
    setColor(null)
  }

  const activeUrl = kind === 'model' ? variant.modelUrl : variant.imageUrl
  const summary = `${product.name} / ${variant.label} / ${kind === 'model' ? '3D Model' : 'Render'}`

  useEffect(() => {
    if (authStatus.status === 'authenticated' && !pinged) {
      setPinged(true)
      // TODO: Wire up stored conversation metadata fetch
    }
  }, [authStatus.status])

  // useEffect(() =>{
  //   const t = async() => {
  //     console.log("GET CONFIGURATIONS...")
  //     console.log(await getConfigurations())
  //   }
  //   if(authStatus.status === 'authenticated'){
  //     t()
  //   }
  // })

  useEffect(() => {
    if(!initialized && authStatus.user){
      initialize()
    }
  },[authStatus.user])
  

  if (authStatus.status === 'unauthenticated') {
    return <Login />
  }



  return (
    <main className="h-screen flex flex-col w-screen overflow-hidden bg-zinc-950 text-zinc-100 absolute">
      {/* Header */}
      <header className="grow-0 flex items-center justify-between border-b border-zinc-800 px-4 py-2 lg:px-6">
        <div className="flex items-center gap-3">
          {/* Placeholder for brand icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
            
            <div className="h-4 w-4 rounded bg-[rgb(251,44,54)]" />
          </div>
          <div>
            <p className="font-mono text-[18px] tracking-[0.22em] text-zinc-100">sa_config</p>
            <h1 className="text-xs font-semibold tracking-tight  text-zinc-500">Security Product Configurator</h1>
          </div>
        </div>
        {/* <span className="hidden text-xs text-zinc-500 sm:block">Unsaved configuration</span> */}
      </header>

      {/* Main content */}
      <div className="flex grow w-full flex-col gap-6 p-3 lg:flex-row lg:p-6">
        {/* Left section */}
        <section className="flex min-w-0 flex-1 flex-col gap-4">
          {/* Title row with mode switch */}
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-500">Product / {product.id.toUpperCase()}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-zinc-100">Build the safe</h2>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-zinc-700 text-sm">
              <button
                onClick={() => setKind('model')}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition ${
                  kind === 'model' ? 'bg-zinc-700 text-white' : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <div className="h-3.5 w-3.5 rounded bg-zinc-500" />
                3D model
              </button>
              <button
                onClick={() => setKind('image')}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition ${
                  kind === 'image' ? 'bg-zinc-700 text-white' : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <div className="h-3.5 w-3.5 rounded bg-zinc-500" />
                Rendered image
              </button>
            </div>
          </div>

          {/* Preview area */}
          <ProductViewer
            label={`${product.name} · ${variant.label}`}
            modelUrl={variant.modelUrl}
            imageUrl={variant.imageUrl}
            kind={'model'}
            color={color}
          />

          {/* Current configuration bar */}
          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-500">Current configuration</p>
              <p className="mt-1 text-sm font-medium text-zinc-100">{summary}</p>
            </div>
            {/* <p className="text-xs text-zinc-500">Preloaded render updates with your selections</p> */}
          </div>
        </section>

        {/* Right sidebar */}
        <ProductControls
          // products={PRODUCTS}
          // productId={product.id}
          // onProductChange={handleProductChange}
          // variantIndex={variantIndex}
          // onVariantChange={handleVariantChange}
          // kind={kind}
          // onKindChange={setKind}
          // downloadUrl={activeUrl}
        />
      </div>
    </main>
  )
}
