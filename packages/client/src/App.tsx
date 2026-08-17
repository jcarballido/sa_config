import { useEffect, useState } from 'react'
import { ProductViewer } from './components/ProductViewer'
import { ProductControls } from './components/ProductControls'
import { LoadingScreen } from './components/LoadingScreen'
import { Login } from './components/Login'
import { useAuthStore } from './stores/auth.store'
import { PRODUCTS } from './viewerConfig'

export default function App() {
  const auth = useAuthStore((s) => s.auth)
  const [productId, setProductId] = useState(PRODUCTS[0].id)
  const [variantIndex, setVariantIndex] = useState(0)
  const [kind, setKind] = useState<'model' | 'image'>('model')
  const [color, setColor] = useState<string | null>(null)

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

  useEffect(() => {
    const timer = setTimeout(() => {
      useAuthStore.getState().setAuthStatus({ status: 'unauthenticated', session: null, user: null })
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  if (auth.status === 'loading') {
    return <LoadingScreen />
  }

  if (auth.status === 'unauthenticated') {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-xl font-semibold">Asset Studio</h1>
        <p className="text-sm text-zinc-500">UI only — server disconnected, assets shown as placeholders</p>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 md:h-[calc(100vh-6rem)] md:flex-row">
        <div className="h-[50vh] min-h-0 flex-1 md:h-auto">
          <ProductViewer
            label={`${product.name} · ${variant.label}`}
            modelUrl={variant.modelUrl}
            imageUrl={variant.imageUrl}
            kind={kind}
            color={color}
          />
        </div>

        <ProductControls
          products={PRODUCTS}
          productId={product.id}
          onProductChange={handleProductChange}
          variantIndex={variantIndex}
          onVariantChange={handleVariantChange}
          kind={kind}
          onKindChange={setKind}
          color={color}
          onColorChange={setColor}
          downloadUrl={activeUrl}
        />
      </main>
    </div>
  )
}
