import { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../stores/app.store'
import { getAsset, type InMemoryAsset } from '../assets/assetCache'
import { useFrame } from '@react-three/fiber'

type ModelViewerProps = {
  rotate: boolean,
  options?:{
    color?:{
      keypad?:string,
      handle?:string
    }
  }
}

const useAttachment = (scene: THREE.Group, filePath: string, attachmentPointName: string, accessory: string, options?: {color?: string}) => {
  const { scene: attachment } = useGLTF(filePath)

  useEffect(() => {
    // console.log('Running useEffect')
    const mount = scene?.getObjectByName(attachmentPointName)
    if (!mount) {
      console.log(`Attachemnt point for ${accessory} was not found`)
      return
    }
    const instance = attachment.clone()
    const color = options?.color
    // console.log("COLOR IN USEATTACHMENT: ",color)

    if(color !== undefined) {
      instance.traverse((object) => {
      if (object instanceof THREE.Mesh) {
      const material = object.material as THREE.MeshStandardMaterial;
      material.color.set(color);
      }
      })
    };    
    mount.add(instance)

    return () => {mount.remove(instance)}
  }, [scene, filePath,options?.color])
  
}

const Keypad = ({ mainScene, file }: {mainScene: THREE.Group, file:string}) => {
  const {activeColorSelection} = useAppStore()
  useAttachment(mainScene, file, 'Keypad_Mount_Door-1', 'KEYPAD',{color: activeColorSelection?.entry.code.replace("bg-","").replace("[","").replace("]","")})
  return null
}
const Handle = ({ mainScene, file}: {mainScene: THREE.Group, file:string}) => {
  const {activeColorSelection} = useAppStore()
  useAttachment(mainScene, file, 'Drop_Handle_Mount-1', 'HANDLE',{color: activeColorSelection?.handle.code.replace("bg-","").replace("[","").replace("]","")})
  return null
}

const Safe = ({
  body,
  entry,
  handle,
  rotate,
  options}:{
  body:string|null,
  entry:string|null,
  handle:string|null,
  rotate:boolean,
  options?: {
    color?:{
      entry?:string,
      handle?:string
    }
  }
}) => {
  if(!body) return null
  const {scene} = useGLTF(body)
  const [hinge, setHinge] = useState<THREE.Object3D|null>(null)
  const [ color, setColor ] = useState<string>()

  const { activeColorSelection } = useAppStore()

  useEffect(() => {
    console.log("ACTIVE color selection")
    console.log(activeColorSelection?.body)
    if(!activeColorSelection?.body) return
    setColor(activeColorSelection?.body.code.replace('bg-','').replace('[','').replace(']',''))
    // const instance = scene.clone()
    // const color = activeColorSelection?.body.code.replace('bg-','').replace('[','').replace(']','')
    // if (attachmentPoints.includes(object)) {
    //   return;
    // }
    // if(color !== undefined) {
    //   scene.traverse((object) => {
    //   if (object instanceof THREE.Mesh) {
    //   const material = object.material as THREE.MeshStandardMaterial;
    //   material.color.set(color);
    //   }
    //   })
    // };
  },[activeColorSelection?.body])



  useEffect(() => {
    if (!scene) return;
    const bodyHinge = scene.getObjectByName("Body_Hinge_Pivot-1")||null;
    setHinge(bodyHinge)
    const door = scene.getObjectByName("Large_Door_w_Mount");
    if (!bodyHinge || !door) return
    const originalParent = door.parent;
    bodyHinge.attach(door);
    console.log("COLOR:")
    console.log(color)
    if (color !== undefined) {
      const updateColor = (object: THREE.Object3D) => {
      if ([door].includes(object)) return;

      if (object instanceof THREE.Mesh) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.color.set(color);
        }
      });
    }

    object.children.forEach(updateColor);
    };
      updateColor(scene);
    }

    // const instance = scene.clone()
    // const color = activeColorSelection?.body.code.replace('bg-','').replace('[','').replace(']','')
    // console.log("ACTIVE COLOR")
    // console.log(activeColorSelection)
    // console.log("COLOR IN USEATTACHMENT: ",color)

    // if(color !== undefined) {
    //   instance.traverse((object) => {
    //   if (object instanceof THREE.Mesh) {
    //   const material = object.material as THREE.MeshStandardMaterial;
    //   material.color.set(color);
    //   }
    //   })
    // };
    // if(rotate && hinge) {

    //   if(rotate) hinge.rotation.y = THREE.MathUtils.degToRad(120);
    // }
    // if(!rotate && hinge) hinge.rotation.y = THREE.MathUtils.degToRad(0);
    return () => {
      if (originalParent) {
        originalParent.attach(door);
      }
    };
  }, [body,color])

  useFrame((_,delta) => {
    if(!hinge) {
      console.log("HINGE IS NOT PRESENT")
      return
    }
    const deg = rotate ? THREE.MathUtils.degToRad(120) : 0
    hinge.rotation.y = THREE.MathUtils.damp(
      hinge.rotation.y,
      deg,
      3,
      delta
    )
  })
 
  return(
    <>
      {body && entry && handle && 
        <>
          <primitive object={scene} />
          <Keypad mainScene={scene} file={entry} />
          <Handle mainScene={scene} file={handle} />        
        </>
      }
    </>
  )
}

export function ModelViewer({ rotate,options }: ModelViewerProps) {
  const { activeSelection } = useAppStore()
  const [bodyURL, setBodyURL] = useState<InMemoryAsset['url'] | null>(null)
  const [entryURL, setEntryURL] = useState<InMemoryAsset['url'] | null>(null)
  const [handleURL, setHandleURL] = useState<InMemoryAsset['url'] | null>(null)
  const bodyId = activeSelection.get('Body')
  const entryId = activeSelection.get('Entry')
  const handleId = activeSelection.get('Handle')
  useEffect(() => {
    console.log("EFFECT RUNNING")
    if (!bodyId || !entryId || !handleId) {
      console.log("ID MISSING")
      return
    }

    async function load() {
      try {
        if (!bodyId || !entryId || !handleId) {
          throw new Error(`ASSET ID NOT FOUND"
            Body ID: ${bodyId})
            Entry ID: ${entryId}
            Handle ID: ${handleId}`)
        }
            // console.log("COLOR OPTIONS: ")
            // console.log(options)

        const body = await getAsset(bodyId)
        const entry = await getAsset(entryId)
        const handle = await getAsset(handleId)
          setBodyURL(body.url)
          setEntryURL(entry.url)
          setHandleURL(handle.url)
      } catch (error) {
        console.log("ERROR CAUGHT IN LOAD")
        console.log(error)
      }
    }

    load()

  }, [activeSelection])

  return (
    <>
      <Safe body={bodyURL} handle={handleURL} entry={entryURL} rotate={rotate} options={options}/>
    </>
  )
}