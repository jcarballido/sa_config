import { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../stores/app.store'
import { getAsset, type InMemoryAsset } from '../assets/assetCache'
import { useFrame } from '@react-three/fiber'

type ModelViewerProps = {
  url: string
  color?: string | null
}

function hasColor(mat: THREE.Material): mat is THREE.Material & { color: THREE.Color } {
  return 'color' in mat
}

const useAttachment = (scene, filePath: string, attachmentPointName, accessory, color?, rotate?) => {

  const { scene: attachment } = useGLTF(filePath)

  useEffect(() => {
    console.log('Running useEffect')
    const mount = scene?.getObjectByName(attachmentPointName)
    if (!mount) {
      console.log(`Attachemnt point for ${accessory} was not found`)
      return
    }
    const instance = attachment.clone()
    if(color) {
      instance.traverse((object) => {
      if (object instanceof THREE.Mesh) {
      const material = object.material as THREE.MeshStandardMaterial;
      material.color.set(color);
      }
      })
    };    

    mount.add(instance)

    return () => mount.remove(instance)
  }, [scene, filePath])
}

const Keypad = ({ mainScene, file }: any) => {
  console.log("Running Keypad component.")
  useAttachment(mainScene, file, 'Keypad_Mount_Door-1', 'KEYPAD')
  return null
}
const Handle = ({ mainScene, file }: any) => {
  useAttachment(mainScene, file, 'Drop_Handle_Mount-1', 'HANDLE','#FF1493', true)
  return null
}

const Safe = ({body, entry, handle, rotate}:{body:string|null,entry:string|null,handle:string|null, rotate:boolean}) => {
  if(!body) return null
  const {scene} = useGLTF(body)
  const [hinge, setHinge] = useState<THREE.Object3D|null>(null)
  useEffect(() => {
    if (!scene) return;
    const bodyHinge = scene.getObjectByName("Body_Hinge_Pivot-1")||null;
    setHinge(bodyHinge)
    const door = scene.getObjectByName("Large_Door_w_Mount");
    if (!bodyHinge || !door) return
    const originalParent = door.parent;
    bodyHinge.attach(door);
    return () => {
      if (originalParent) {
        originalParent.attach(door);
      }
    };
  }, [body])

    if(rotate && hinge) {
      hinge.rotation.y = THREE.MathUtils.degToRad(45);
    }

 
  // useFrame((_, delta) => {
  //   if (!hinge) return;

  //     // Rotate continuously around the pivot's local Y axis
  //   hinge.rotation.y -= delta;
  // });


  return(
    <>
     {body && entry && handle && 
      <>
        <primitive object={scene} />
        <Keypad mainScene={scene} file={entry} />
        <Handle mainScene={scene} file={handle} />        
      </>
     }
    </>)

}

export function ModelViewer({ url, color }: ModelViewerProps) {
  const { activeSelection } = useAppStore()
  const [bodyURL, setBodyURL] = useState<InMemoryAsset['url'] | null>(null)
  const [entryURL, setEntryURL] = useState<InMemoryAsset['url'] | null>(null)
  const [handleURL, setHandleURL] = useState<InMemoryAsset['url'] | null>(null)
  // const {body: bodyId, entry: entryId, handle: handleId} = activeSelection
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
      <Safe body={bodyURL} handle={handleURL} entry={entryURL} rotate={true}/>
    </>
  )
}