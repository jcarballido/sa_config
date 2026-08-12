import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ModelViewer } from './ModelViewer'
import { ErrorBoundary } from './ErrorBoundary'

type ProductViewerProps = {
  label: string
  modelUrl: string | null
  imageUrl: string | null
  kind: 'model' | 'image'
  color: string | null
}

function PreviewError({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">{message}</div>
    </div>
  )
}

export function ProductViewer({ label, modelUrl, imageUrl, kind, color }: ProductViewerProps) {
  const [imageError, setImageError] = useState(false)
  const activeUrl = kind === 'model' ? modelUrl : imageUrl

  useEffect(() => {
    setImageError(false)
  }, [imageUrl])

  return (
    <div className="h-full min-h-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      {!activeUrl ? (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <div className="h-48 w-48 rounded-lg border border-zinc-700 bg-zinc-800" />
          <p className="text-sm text-zinc-500">
            {kind === 'model' ? '3D model placeholder' : 'Render placeholder'}
          </p>
          <p className="text-xs text-zinc-600">{label}</p>
        </div>
      ) : kind === 'model' ? (
        <ErrorBoundary key={modelUrl} fallback={<PreviewError message="Failed to load 3D model" />}>
          <Canvas key={modelUrl} camera={{ position: [2.5, 1.75, 2.5], fov: 45 }} dpr={[1, 2]} shadows>
            <ambientLight intensity={0.5} />
            <directionalLight position={[4, 5, 3]} intensity={1.6} castShadow />
            <directionalLight position={[-4, -2, -3]} intensity={0.4} />
            <Suspense fallback={null}>
              <ModelViewer url={modelUrl!} color={color} />
            </Suspense>
            <OrbitControls enablePan={false} autoRotate autoRotateSpeed={2} />
          </Canvas>
        </ErrorBoundary>
      ) : imageError ? (
        <PreviewError message="Failed to load image" />
      ) : (
        <div className="flex h-full items-center justify-center p-4">
          <div className="relative">
            <img
              src={imageUrl!}
              alt={label}
              className="max-h-full max-w-full object-contain"
              onError={() => setImageError(true)}
            />
            {color && (
              <div
                className="pointer-events-none absolute inset-0 mix-blend-multiply"
                style={{ backgroundColor: color }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
