import { getToken } from "../api/authAdapter"
import type { Configuration } from "../api/types"
import { useAppStore } from "../stores/app.store"

export async function getImages (assetId: Configuration["id"]){
  // Get image hashes from DB
  try {
    const token = getToken()
    if(!token) throw new Error("Missing access token")
    const activeConfiguration = useAppStore.getState().activeConfiguration
    if(!activeConfiguration) throw new Error("Active Configuration Not Found")
    const response= await fetch(`assets/${storageKey}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }})
    const blob = await response.blob()
    return images    
  } catch (error) {
    console.log("ERROR in getAsset")
    throw error
  }

  // Get images from R2 bucket, return data
}