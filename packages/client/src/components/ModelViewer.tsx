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

export function ModelViewer({ url, color }: ModelViewerProps) {
  const { scene } = useGLTF(url)
  const originalColors = useRef(new WeakMap<THREE.Material, THREE.Color>())

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const scale = 2 / maxDim
      scene.scale.setScalar(scale)
    }
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.castShadow = true
    })
  }, [scene])

  useEffect(() => {
    const materials = new Set<THREE.Material>()
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const list = Array.isArray(obj.material) ? obj.material : [obj.material]
        for (const mat of list) materials.add(mat)
      }
    })

    for (const mat of materials) {
      if (!hasColor(mat)) continue
      if (color) {
        if (!originalColors.current.has(mat)) {
          originalColors.current.set(mat, mat.color.clone())
        }
        mat.color.set(color)
      } else {
        const original = originalColors.current.get(mat)
        if (original) mat.color.copy(original)
      }
    }
  }, [scene, color])

  return <primitive object={scene} />
}
