import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ModelViewer } from './ModelViewer'
import { ErrorBoundary } from './ErrorBoundary'
// import { useAppStore } from '../stores/app.store'

type ProductViewerProps = {
  label: string
  modelUrl: string | null
  imageUrl: string | null
  kind: 'model' | 'image'
  // color: string | null,
  rotate: boolean
  options?:{
    color:{
      keypad?:string,
      handle?:string
    }
  }
}

function PreviewError({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">{message}</div>
    </div>
  )
}

export function ProductViewer({ label, modelUrl, imageUrl, kind, options,rotate }: ProductViewerProps) {
  // const { configurations } = useAppStore()
  const [imageError, setImageError] = useState(false)
  const [ open, setOpen ] = useState<boolean>(false)
  // const activeUrl = kind === 'model' ? modelUrl : imageUrl
  const activeUrl = "model"
  // console.log("CONFIGURATIONS:")
  // console.log(configurations)
  useEffect(() => {
    setImageError(false)
  }, [imageUrl])

  if (!activeUrl) {
    console.log("NO ACTIVE URL")
    return (
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] border border-blue-500 bg-[#171717] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        {/* Gradient background */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#393632,transparent_38%),linear-gradient(145deg,#252525,#101010)]" /> */}
        {/* Live preview badge */}
        <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-[#c6c0b8] backdrop-blur">
          <div className="h-3.5 w-3.5 rounded bg-zinc-600" />
          PREVIEW
        </div>
        {/* Icon button placeholders */}
        <div className="absolute right-5 top-5 z-10 flex gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 backdrop-blur">
            <div className="h-4 w-4 rounded bg-zinc-600" />
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 backdrop-blur">
            <div className="h-4 w-4 rounded bg-zinc-600" />
          </div>
        </div>
        {/* Orbit instructions */}
        <div className="absolute bottom-5 left-6 z-10 flex items-center gap-2 text-xs text-[#9b958d]">
          <div className="h-3.5 w-3.5 rounded bg-zinc-600" />
          Orbit to inspect · Scroll to zoom
        </div>
        {/* Placeholder content */}
        <div className="flex h-full min-h-130 flex-col items-center justify-center gap-3 ">
          <div className="h-48 w-48 rounded-lg border border-zinc-700 bg-zinc-800" />
          <p className="text-sm text-zinc-500 bg-yellow-300">
            {kind === 'model' ? '3D model placeholder' : 'Render placeholder'}
          </p>
          <p className="text-xs text-zinc-600">{label}</p>
        </div>
      </div>
    )
  }

  if (kind === 'model') {
    return (
      <div className="relative min-h-130 flex-1 overflow-hidden rounded-[28px] border-2  bg-[#171717] shadow-[0_24px_80px_rgba(0,0,0,0.35)] border-[rgb(251,44,54)]">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#393632,transparent_38%),linear-gradient(145deg,#252525,#101010)]" />
        {/* Live preview badge */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 text-xs text-[#9b958d]">
          <div className="h-3.5 w-3.5 rounded bg-zinc-600" />
          Preview
        </div>

        {/* <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-[#c6c0b8] backdrop-blur"> */}
          {/* <div className="h-3.5 w-3.5 rounded bg-zinc-600" /> */}
          {/* PREVIEW
        </div> */}
        {/* Icon button placeholders */}
        <div className="absolute right-6 top-6 z-10 flex gap-2">
          <div 
            className="flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-[#e4dfd8] backdrop-blur transition-colors hover:bg-white/15 hover:text-white relative" 
            //  className="absolute right-6 top-6 z-10 rounded-full border border-white/15 bg-black/50 px-3 py-2 text-xs font-medium text-[#c6c0b8] backdrop-blur transition-colors hover:border-white/25 hover:bg-black/70 hover:text-white active:bg-black/80"

            onClick={() => setOpen(prev => !prev)}  
          >
            {/* <div className='absolute w-full h-full px-3 py-2 flex items-center justify-center'>PREVIEW</div> */}
            {/* <div className="h-4 w-4 rounded bg-zinc-600" /> */}
            {open ? "Close":"Open"}
          </div>
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 backdrop-blur">
            <div className="h-4 w-4 rounded bg-zinc-600" />
          </div> */}
        </div>
        {/* Orbit instructions */}
        <div className="absolute bottom-5 left-6 z-10 flex items-center gap-2 text-xs text-[#9b958d]">
          <div className="h-3.5 w-3.5 rounded bg-zinc-600" />
          Orbit to inspect · Scroll to zoom
        </div>
        {/* 3D Canvas */}
        <ErrorBoundary key={modelUrl} fallback={<PreviewError message="Failed to load 3D model" />}>
          <Canvas key={modelUrl} camera={{ position: [4.4, 3.1, 5.4], fov: 38 }} dpr={[1, 2]} shadows>
            <ambientLight intensity={0.8} />
            <directionalLight position={[4, 6, 4]} intensity={3} castShadow />
            <directionalLight position={[4, -1, 1]} intensity={2} color="#ff7a1a" />
            <Suspense fallback={null}>
              <ModelViewer rotate={open} options={options} />
            </Suspense>
            <OrbitControls enablePan={false} minDistance={1} maxDistance={4} minPolarAngle={0.65} maxPolarAngle={1.5} />
          </Canvas>
        </ErrorBoundary>
      </div>
    )
  }

  // Image mode
  return (
    <div className="relative flex-1 min-h-0 overflow-hidden rounded-[28px] border border-zinc-800 bg-[#171717] p-4">
      {imageError ? (
        <PreviewError message="Failed to load image" />
      ) : (
        <div className="relative">
          <img
            src={imageUrl!}
            alt={label}
            className="h-full min-h-full w-full rounded-[20px] object-contain"
            onError={() => setImageError(true)}
          />
          {/* {color && (
            <div
              className="pointer-events-none absolute inset-0 mix-blend-multiply rounded-[20px]"
              style={{ backgroundColor: color }}
            />
          )} */}
        </div>
      )}
    </div>
  )
}
