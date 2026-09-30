import { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../stores/app.store'
import { getAsset  } from '../assets/assetCache'

type ModelViewerProps = {
  url: string
  color?: string | null
}

function hasColor(mat: THREE.Material): mat is THREE.Material & { color: THREE.Color } {
  return 'color' in mat
}

const useAttachment = (scene, filePath: string, attachmentPointName, accessory) => {

    const {scene: attachment} = useGLTF(filePath)


    useEffect(() => {
        console.log('Running useEffect')
        const mount = scene?.getObjectByName(attachmentPointName)
        if(!mount) {
            console.log(`Attachemnt point for ${accessory} was not found`)
            return
        }
        const instance = attachment.clone()
        mount.add(instance)

        return () => mount.remove(instance)
    },[scene,filePath])
}

const Keypad = ({mainScene, file}: any) => {
    console.log("Running Keypad component.")
    // const { activeSelection } = useAppStore()
    // const [ url, setURL ] = useState<string|null>(null)
    useAttachment(mainScene, file, 'Keypad_Mount_Door-1', 'KEYPAD')
    // const keypadId = activeSelection.entry
    // useEffect(() => {
    //     if(!keypadId) return
    //     console.log("KEYPAD FOUND")
    //     const load = async () => {
    //         const asset = await getAsset(keypadId)
    //         console.log("KEYPAD ASSET")
    //         console.log(asset)
    //         setURL(asset.url)
    //     }
    //     load()
    // },[activeSelection]) 

    return null
}
const Handle = ({mainScene,file}: any) => {
    // const { activeSelection } = useAppStore()
    // const handleId = activeSelection.handle
    // if(!handleId) return null
    // const asset = await getAsset(handleId)
    useAttachment(mainScene, file, 'Drop_Handle_Mount-1', 'HANDLE')
    return null
}

export function ModelViewer({ url, color }: ModelViewerProps) {
    const { activeSelection } = useAppStore()
    const [ body, setBody ] = useState<THREE.Group|null>(null)
    const [ entryURL, setEntryURL] = useState<string|null>(null)
    const [ handleURL, setHandleURL] = useState<string|null>(null)
    // const {body: bodyId, entry: entryId, handle: handleId} = activeSelection
    const bodyId = activeSelection.get('Body')
    const entryId = activeSelection.get('Entry') 
    const handleId = activeSelection.get('Handle')
    useEffect(() => {
        console.log("EFFECT RUNNING")
        if(!bodyId || ! entryId || !handleId) {
            console.log("ID MISSING")
            return
        }

        async function load() {
            try {
                if(!bodyId || ! entryId || !handleId) {
                    throw new Error(`ASSET ID NOT FOUND"
                     Body ID: ${bodyId})
                    Entry ID: ${entryId}
                    Handle ID: ${handleId}`)
                } 
                    const asset = await getAsset(bodyId)
                    console.log("ASSET: ", asset)
                    const entry = await getAsset(entryId)
                    console.log("ENTRY: ", entry)
                    const handle = await getAsset(handleId)
                    console.log("HANDLE: ", handle)
                    try {
                        
                        const {scene} = useGLTF(asset.url)
                        setBody(scene)
                        setEntryURL(entry.url)
                        setHandleURL(handle.url)                
                    } catch (error) {
                        console.log("USE GLTF error")
                        throw error
                    }

                    
            } catch (error) {
                console.log("ERROR CAUGHT IN LOAD")
                console.log(error)
            }
        }

        load()            

    },[activeSelection])

  useEffect(() => {
    if (!body) return;
    const bodyHinge = body.getObjectByName("Body_Hinge_Pivot-1");
    const door = body.getObjectByName("Small_Door_w_Mount");
    if(!bodyHinge || !door) return
    const originalParent = door.parent;
    bodyHinge.attach(door);
    return () => {
        if (originalParent) {
            originalParent.attach(door);
        }
    };
},[body])

//   useFrame((_, delta) => {
//     if (!bodyHinge) return;

//     // Rotate continuously around the pivot's local Y axis
//     bodyHinge.rotation.y += delta;
//   });;

  
  return (
    <>
        {body && <>
            <primitive object={body} />
            <Keypad mainScene={body} file={entryURL}/>
            <Handle mainScene={body} file={handleURL} />
        </> }
    </>
  )
  // const { scene } = useGLTF(url)
  // const originalColors = useRef(new WeakMap<THREE.Material, THREE.Color>())

  // useEffect(() => {
  //   const box = new THREE.Box3().setFromObject(scene)
  //   const size = box.getSize(new THREE.Vector3())
  //   const maxDim = Math.max(size.x, size.y, size.z)
  //   if (maxDim > 0) {
  //     const scale = 2 / maxDim
  //     scene.scale.setScalar(scale)
  //   }
  //   scene.traverse((obj) => {
  //     if (obj instanceof THREE.Mesh) obj.castShadow = true
  //   })
  // }, [scene])

  // useEffect(() => {
  //   const materials = new Set<THREE.Material>()
  //   scene.traverse((obj) => {
  //     if (obj instanceof THREE.Mesh) {
  //       const list = Array.isArray(obj.material) ? obj.material : [obj.material]
  //       for (const mat of list) materials.add(mat)
  //     }
  //   })

  //   for (const mat of materials) {
  //     if (!hasColor(mat)) continue
  //     if (color) {
  //       if (!originalColors.current.has(mat)) {
  //         originalColors.current.set(mat, mat.color.clone())
  //       }
  //       mat.color.set(color)
  //     } else {
  //       const original = originalColors.current.get(mat)
  //       if (original) mat.color.copy(original)
  //     }
  //   }
  // }, [scene, color])

  // return <primitive object={scene} />
}
