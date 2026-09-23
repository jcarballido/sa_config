import { getToken } from "../api/authAdapter"
import type { AssetMetadata } from "../api/types"
import { useAppStore } from "../stores/app.store"

export type InMemoryAsset = {
  blob: Blob,
  url: string
}

export const assetCache = new Map<AssetMetadata["id"], InMemoryAsset>()

export async function getAsset (assetId: AssetMetadata["id"]): Promise<InMemoryAsset>{
  const token = getToken()
  if(!token) throw new Error("Missing access token")
  const assetMetadata = useAppStore.getState().assetMetadata
  if(!assetMetadata) throw new Error("Asset Metadata Missing")
  const inMemoryAsset = assetCache.get(assetId)
  if(!inMemoryAsset) {
    // fetch blob
    try {
      const storageKey = assetMetadata.get(assetId)?.storageKey.replace("products/","")
      console.log("STORAGE KEY:")
      console.log(storageKey)
      if(!storageKey) throw new Error("This asset does not exist.")
      const response= await fetch(`assets/${storageKey}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      console.log("RESPONSE FROM BLOB FETCH")
      console.log(response)
      const blob = await response.blob()
      const asset =  {
        blob,
        url: URL.createObjectURL(blob)
      }
      assetCache.set(assetId, asset)
      return asset
    } catch (error) {
      throw new Error("Error fetching from bucket")
    }
  }
  return inMemoryAsset
}