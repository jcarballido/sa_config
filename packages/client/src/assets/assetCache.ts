import { getToken } from "../api/authAdapter"
import type { AssetMetadata } from "../api/types"
import { useAppStore } from "../stores/app.store"

export const assetCache = new Map<AssetMetadata["id"],Blob>()

export async function getAsset (assetId: AssetMetadata["id"]): Promise<Blob>{
  const token = getToken()
  if(!token) throw new Error("Missing access token")
  const assetMetadata = useAppStore.getState().assetMetadata
  if(!assetMetadata) throw new Error("Asset Metadata Missing")
  const blob = assetCache.get(assetId)
  if(!blob) {
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
      const b = await response.blob()
      assetCache.set(assetId, b)
      return b
    } catch (error) {
      throw new Error("Error fetching from bucket")
    }
  }
  return blob
}