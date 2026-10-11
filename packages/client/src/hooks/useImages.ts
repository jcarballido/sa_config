import { useAppStore } from "../stores/app.store"

const useImages = (): string[] => {
  const { activeImageIds, imageAssetMetadata, activeConfiguration } = useAppStore()
  if(!activeImageIds || !activeConfiguration) return []

  const imageSrc = activeImageIds.map(id => {
    const { storageKey } = id
    return `assets/${storageKey}`
  })

  return imageSrc
  
}

export default useImages