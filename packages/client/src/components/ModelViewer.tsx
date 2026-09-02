import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type ModelViewerProps = {
  url: string
  color?: string | null
}

function hasColor(mat: THREE.Material): mat is THREE.Material & { color: THREE.Color } {
  return 'color' in mat
}

const useAttachment = (scene, filePath: string, attachmentPointName, accessory) => {
    console.log('Running hook')

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

const Keypad = ({mainScene, filePath}: any) => {
    console.log("Running Keypad component.")
    if(!filePath) {
        console.log("No PATH")
        return null
    }
    console.log('Path found')
    useAttachment(mainScene, filePath, 'Keypad_Mount_Door-1', 'KEYPAD')
    return null
}
const Handle = ({mainScene, filePath}: any) => {
    console.log("Running Handle component.")
    if(!filePath) {
        console.log("No PATH")
        return null
    }
    console.log('Path found')
    useAttachment(mainScene, filePath , 'Drop_Handle_Mount-1', 'HANDLE')
    return null
}



export function ModelViewer({ url, color }: ModelViewerProps) {
  const { scene } = useGLTF("/Large_Housing_w_Mount_v1.glb");
  const bodyHinge = scene.getObjectByName("Body_Hinge_Pivot-1");
  const door = scene.getObjectByName("Small_Door_w_Mount");

  useEffect(() => {
    if (!bodyHinge || !door) return;
    const originalParent = door.parent;
    bodyHinge.attach(door);
    return () => {
        if (originalParent) {
            originalParent.attach(door);
        }
    };
},[bodyHinge, door])

//   useFrame((_, delta) => {
//     if (!bodyHinge) return;

//     // Rotate continuously around the pivot's local Y axis
//     bodyHinge.rotation.y += delta;
//   });;

  
  return (
    <>
        <primitive object={scene} />
        <Keypad mainScene={scene} filePath={'/Touch_Keypad_v7.glb'}/>
        <Handle mainScene={scene} filePath={'/Spoke_Hub_3_v1.glb'} />
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
