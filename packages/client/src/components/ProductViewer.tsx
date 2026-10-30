import { Suspense, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ModelViewer } from './ModelViewer'
import { ErrorBoundary } from './ErrorBoundary'
import { useAppStore } from '../stores/app.store'
import useImages from '../hooks/useImages'
// import { useAppStore } from '../stores/app.store'
import Eye from '../assets/eye-show.svg'
// import Cube from '../assets/cube.svg'
import Rotate from '../assets/360-rotate.svg'
// import Images from '../assets/images.svg'
import Safe from '../assets/safe.svg'

type ProductViewerProps = {
  // label: string
  // modelUrl: string | null
  // imageUrl: string | null
  kind: 'model' | 'image',
  setKind: Dispatch<SetStateAction<'model'|'image'>>
  // color: string | null,
  // options?:{
  //   color:{
  //     entry?:{name:string,code:string},
  //     handle?:{name:string,code:string}
  //   }
  // }
}

function PreviewError({ message }: { message: string }) {
  console.log("Preview Error ran")
  return (
    <div className="flex h-full items-center justify-center">
      <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">{message}</div>
    </div>
  )
}

import { getToken } from '../api/authAdapter'

function ProductImage({ imageUrl, setKind}: any) {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false)

  // console.log("IMAGE URL PASSED IN: ")
  // console.log(imageUrl)

  useEffect(() => {
    const controller = new AbortController();

    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadImage() {
      try {
        const accessToken = getToken()
        const response = await fetch(`${imageUrl}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal
        });
  
        if (!response.ok) {
          throw new Error("Failed to load image");
        }
  
        const blob = await response.blob();
        if (controller.signal.aborted) return;
  
  
        if (cancelled) return;
  
        objectUrl = URL.createObjectURL(blob);
        console.log("Created blob URL:", objectUrl);
  
        setSrc(objectUrl);        
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Image loading failed:", error);
        }
      }
    }

    setSrc(null)
    loadImage();

    return () => {
      // console.log("Effect cleanup:", objectUrl);

      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageUrl]);

  if (!src) return (
      <div className='w-full h-full flex justify-center items-center  bg-transparent p-10'>
        <div className='w-full h-full rounded-xl relative overflow-hidden border border-zinc-800'>
          <div className='absolute w-[75%] h-[200%] right-full bg-linear-[100deg] from-[#171717] from-20% via-[#1C1C1C] via-50% to-[#171717] to-80% animate-[slide_5s_linear_infinite]'></div>
          {/* Loading image... */}
        </div>
      </div>
    )

  if(!imageUrl) {
    console.log("NO IMAGE URL") 
    return (
    <div className='flex flex-col gap-10 items-center '>
      <img src={Safe} className='grow h-[600px]' />
      <span className='text-xl text-zinc-600'>
        No renders for this combination of options yet
      </span>
      <button className='border border-zinc-500 max-w-fit p-4 rounded-lg font-bold hover:bg-zinc-700' onClick={()=>{setKind('model')}}>
        Switch to 3D view
      </button>
    </div>)
  }
  // console.log("SRC: ", src)
  return (
    <div className=" max-h-full min-h-0 grow relative aspect-square overflow-hidden rounded-lg bg-neutral-900">
      {src && (<img   
        src={src}
        alt=''
        onLoad={(e) => {
          // console.log('On Load: ',e.currentTarget.src)
          // console.log("SRC LOADED")
          setLoaded(true)
        }
        }
        className={`h-full w-full object-contain transition-opacity duration-200 ease-in ${
          loaded ? "blur-0 opacity-100" : "blur-sm opacity-0"
        }`}
        // onError={(e)=>console.log("Error loading image: ", e.currentTarget.src)}
      />)}
    </div>
  // <img className='object-contain max-h-full grow min-h-0 rounded-2xl' src={src} alt="Configured product" />;
  )
}

export function ProductViewer({ kind, setKind }: ProductViewerProps) {
  // const { configurations } = useAppStore()
  const [imageError, setImageError] = useState(false)
  const [ open, setOpen ] = useState<boolean>(false)
  const { activeConfiguration, imageAssetMetadata, activeImageIds, setActiveImageIds  } = useAppStore()
  const images = useImages()
  const [activeImage, setActiveImage] = useState<string|null>(null)
  // const {images: array of img src files} = useImages()
  // const activeUrl = kind === 'model' ? modelUrl : imageUrl
  // const activeUrl = "model"
  // console.log("CONFIGURATIONS:")
  // console.log(configurations)
  // useEffect(() => {
  //   setImageError(false)
  // }, [imageUrl])

  useEffect(() => {
    // console.log("Active Config: ")
    // console.log(activeConfiguration)
    // const imageIds = []
    // if(configurations){
    //   for(const config of configurations.values()){
    //     if(config.modelNumber == )
    //   }
    // }
    if(activeConfiguration?.id){
      const hashes = imageAssetMetadata?.get(activeConfiguration?.id) || []
      setActiveImageIds(hashes)
    }
  },[activeConfiguration])

  useEffect(() => {
    // console.log("IMAGE URLS:")
    // console.log(images)
      setActiveImage(images[0])
  },[activeImageIds])

  // if (!activeUrl) {
  //   console.log("NO ACTIVE URL")
  //   return (
  //     <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] border border-blue-500 bg-[#171717] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
  //       {/* Gradient background */}
  //       {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#393632,transparent_38%),linear-gradient(145deg,#252525,#101010)]" /> */}
  //       {/* Live preview badge */}
  //       <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-[#c6c0b8] backdrop-blur">
  //         {/* <div className="h-3.5 w-3.5 rounded bg-zinc-600" /> */}
  //         <img src={Eye} className='h-3.5 w-3.5'/>
  //         PREVIEW
  //       </div>
  //       {/* Icon button placeholders */}
  //       <div className="absolute right-5 top-5 z-10 flex gap-2">
  //         <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 backdrop-blur">
  //           <div className="h-4 w-4 rounded bg-zinc-600" />
  //         </div>
  //         <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 backdrop-blur">
  //           <div className="h-4 w-4 rounded bg-zinc-600" />
  //         </div>
  //       </div>
  //       {/* Orbit instructions */}
  //       <div className="absolute bottom-5 left-6 z-10 flex items-center gap-2 text-xs text-[#9b958d]">
  //         <div className="h-3.5 w-3.5 rounded bg-zinc-600" />
  //         Orbit to inspect · Scroll to zoom
  //       </div>
  //       {/* Placeholder content */}
  //       <div className="flex h-full min-h-130 flex-col items-center justify-center gap-3 ">
  //         <div className="h-48 w-48 rounded-lg border border-zinc-700 bg-zinc-800" />
  //         <p className="text-sm text-zinc-500 bg-yellow-300">
  //           {kind === 'model' ? '3D model placeholder' : 'Render placeholder'}
  //         </p>
  //         {/* <p className="text-xs text-zinc-600">{label}</p> */}
  //       </div>
  //     </div>
  //   )
  // }

  if (kind === 'model') {
    return (
      <div className="relative min-h-130 flex-1 overflow-hidden rounded-[28px] border border-white/20  bg-[#171719] shadow-[0_24px_80px_rgba(0,0,0,0.35)] ">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#393632,transparent_38%),linear-gradient(145deg,#252525,#101010)]" />
        {/* Live preview badge */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 text-xs text-[#9b958d] opacity-50">
          {/* <div className="h-3.5 w-3.5 rounded bg-zinc-600" /> */}
          <img src={Eye} className='h-6 w-6'/>
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
          {/* <div className="h-3.5 w-3.5 rounded bg-zinc-600" /> */}
          <img src={Rotate} className='w-3.5 h-3.5'/>
          Orbit to inspect · Scroll to zoom
        </div>
        {/* 3D Canvas */}
        <ErrorBoundary fallback={<PreviewError message="Failed to load 3D model" />}>
          <Canvas  camera={{ position: [4.4, 3.1, 5.4], fov: 38 }} dpr={[1, 2]} shadows>
            <ambientLight intensity={0.8} />
            <directionalLight position={[4, 6, 4]} intensity={3} castShadow />
            <directionalLight position={[-8, -1, 5]} intensity={2} color="#FFFFFF" />
            <Suspense fallback={null}>
              <ModelViewer rotate={open}  />
            </Suspense>
            <OrbitControls enablePan={false} minDistance={1} maxDistance={4} minPolarAngle={0.65} maxPolarAngle={1.5} />
          </Canvas>
        </ErrorBoundary>
      </div>
    )
  }

  // Image mode
  return (
    <div className=" min-h-0 rounded-[28px] border bg-[#171717] p-4 h-full border-white/20">
      {imageError ? (
        <PreviewError message="Failed to load image" />
      ) : (
        <div className="h-full  min-h-0 p-4 ">
          <div className='h-[80%]  flex items-center justify-center p-10'>
            <ProductImage imageUrl={activeImage} setKind={setKind}/>
          </div>          
          <div className='flex  min-h-0 h-[20%] gap-4 p-2 '>
            {
              images  
              ? images.map(imageKey => {
                return(
                  <div className={`max-h-full flex items-center justify-center w-40 border  bg-black/20 rounded-2xl p-4  hover:opacity-100 ${activeImage === imageKey ? 'opacity-100 border-white':'opacity-50'}`} onClick={activeImage === imageKey ? ()=>null:() => setActiveImage(imageKey)}>
                    <ProductImage imageUrl={imageKey} setKind={setKind}/>
                  </div>
                )
              })
              : null
      //         :  <div className='w-full h-full flex justify-center items-center  bg-transparent p-20 border border-orange-500'>
      //             <div className='w-full h-full rounded-xl relative overflow-hidden border border-zinc-800'>
      //             <div className='absolute w-[75%] h-[200%] right-full bg-linear-[100deg] from-[#171717] from-20% via-[#1C1C1C] via-50% to-[#171717] to-80% animate-[slide_5s_linear_infinite]' />
      //           </div>
      // </div>
            }             
          </div>
          {/* <img
            src={imageUrl!}
            alt={label}
            className="h-full min-h-full w-full rounded-[20px] object-contain"
            onError={() => setImageError(true)}
          /> */}
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
