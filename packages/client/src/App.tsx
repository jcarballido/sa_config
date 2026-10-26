import { useEffect, useState } from 'react'
import { ProductViewer } from './components/ProductViewer'
import { ProductControls } from './components/ProductControls'
import { Login } from './components/Login'
import { useAuthStore } from './stores/auth.store'
// import { PRODUCTS } from './viewerConfig'
// import { getConfigurations } from './api/configurations.api'
import { useAppStore } from './stores/app.store'
import Cube from './assets/cube.svg'
import Images from './assets/images.svg'
// import colorVariants from '../src/constants/colorVariants'
// import type { ColorOption } from './components/types'

export default function App() {
  const { authStatus } = useAuthStore()
  const { initialize, initialized, imageAssetMetadata } = useAppStore()
  // const [productId, setProductId] = useState(PRODUCTS[0].id)
  // const [variantIndex, setVariantIndex] = useState(0)
  const [kind, setKind] = useState<'model' | 'image'>('model')
  // const [color, setColor] = useState<string | null>(null)
  const [pinged, setPinged] = useState<boolean>(false)
  // const [color, setColor] = useState<{color:ColorOption}>({color:{body:{name:"",code:""},handle:{name:"",code:""},entry:{name:"",code:""}}})
  const [ rotate, setRotate ] =useState<boolean>(false)

  // const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0]
  // const variant = product.variants[Math.min(variantIndex, product.variants.length - 1)]

  // function handleProductChange(id: string) {
  //   setProductId(id)
  //   setVariantIndex(0)
  //   // setColor(null)
  // }

  // function handleVariantChange(index: number) {
  //   setVariantIndex(index)stringstring
  //   // setColor(null)
  // }

  // const summary = `${product.name} / ${variant.label} / ${kind === 'model' ? '3D Model' : 'Render'}`

  useEffect(() => {
    if (authStatus.status === 'authenticated' && !pinged) {
      setPinged(true)
    }
  }, [authStatus.status])

  useEffect(() => {
    if(!initialized && authStatus.user){
      initialize()
    }
  },[authStatus.user])


  // useEffect(() => {
  //   setColor({
  //     color:{
  //       body:colorVariants.body[0],
  //       entry:colorVariants.entry[0],
  //       handle:colorVariants.handle[0]
  //     }
  //   })
  // },[])
  

  if (authStatus.status === 'unauthenticated') {
    return <Login />
  }

  return (
    <main className="flex flex-col w-full h-full overflow-hidden bg-zinc-950 text-zinc-100 absolute">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between border-b border-zinc-800 px-4 py-4 lg:px-6">
        <div className="flex items-cestringnter gap-3">
          {/* Placeholder for brand icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
            
            <div className="h-4 w-4 rounded bg-[rgb(251,44,54)]" />
          </div>
          <div>
            <p className="font-mono text-[18px] tracking-[0.08em] text-zinc-100">SA_CONFIG</p>
            <h1 className="text-xs font-semibold tracking-tight  text-zinc-500">Design Your Safe</h1>
          </div>
        </div>
        {/* <span className="hidden text-xs text-zinc-500 sm:block">Unsaved configuration</span> */}
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0 overflow-hidden  w-full flex-col gap-6 p-3 lg:flex-row lg:p-6 h-full">
        {/* Left section */}
        <section className="flex min-w-0 min-h-0 flex-1 flex-col gap-4">
          {/* Title row with mode switch */}
          <div className="flex items-end justify-between ">
            <div>
              {/* <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-500">Product / </p> */}
              <h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-zinc-100">Build your safe</h2>
            </div>
            <div className='border border-zinc-500 p-1  rounded-lg'>
              <div className="flex relative text-sm ">
                <div className={`bg-zinc-600 w-1/2 absolute h-full rounded-sm  transition-transform duration-300 ease-in-out ${kind === 'model'? 'translate-x-0':'translate-x-full '}`} />
                <button
                  onClick={() => setKind('model')}
                  className={`flex items-center justify-center gap-1.5  py-1.5 transition w-1/2  z-10 ${
                    kind === 'model' ? ' text-white ' : ' text-zinc-400 '
                  }`}
                >
                  {/* <div className="h-3.5 w-3.5 rounded bg-zinc-500" /> */}
                  <img src={Cube} className='w-3.5 h-3.5'/>
                  3D view
                </button>
                <button
                  onClick={() => setKind('image')}
                  className={`flex items-center gap-1.5 px-7 w-1/2 justify-center py-1.5 text-nowrap transition rounded-lg z-10 ${
                    kind === 'image' ? ' text-white' : ' text-zinc-400  '
                  }`}
                >
                  {/* <div className="h-3.5 w-3.5 rounded bg-zinc-500" /> */}
                  <img src={Images} className='w-3.5 h-3.5 '/>

                  Photo View
                </button>
              </div>
            </div>
          </div>

          {/* Preview area */}
          <ProductViewer
            // label={`${product.name} · ${variant.label}`}
            // modelUrl={variant.modelUrl}
            // imageUrl={variant.imageUrl}
            kind={kind}
            setKind={setKind}
            // color={color}
            // options={color}
          />

          {/* Current configuration bar */}
          {/* <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 h-full">
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-500">Current configuration</p>
              <p className="mt-1 text-sm font-medium text-zinc-100">{summary}</p>
            </div> */}
            {/* <p className="text-xs text-zinc-500">Preloaded render updates with your selections</p> */}
          {/* </div> */}
        </section>

        {/* Right sidebar */}
        <ProductControls  setRotate={setRotate} rotate={rotate}/>
      </div>
    </main>
  )
}
