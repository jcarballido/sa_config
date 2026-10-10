// import { useAuthStore } from "../stores/auth.store";
import { getToken } from "./authAdapter";
import http from "./client";
import { type AssetMetadata, AssetMetadataArraySchema, type ImageAssetMetadata, ImageAssetMetadataArraySchema, ImageAssetMetadataSchema } from "./types";

type AssetMetadataMap = Map<AssetMetadata['id'],AssetMetadata>
type ImageAssetMetadataMap = Map<ImageAssetMetadata['configurationId'],ImageAssetMetadata[]>

export async function getAssestMetadata(): Promise<AssetMetadataMap>{
  // const token = useAuthStore.getState().authStatus.session?.access_token
  const token = getToken()
  if(!token) throw new Error("Unauthorized.")
  const response = await http.getPrivate<AssetMetadata[]>('api/assets/assets',token)
  console.log("GET METADATA RESONSE:")
  console.log(response)
  const result = AssetMetadataArraySchema.safeParse(response)
  if(!result.success) throw new Error("Response violated contract for request: getAssets-Assets.")
  const map: AssetMetadataMap = new Map()
  for(const asset of result.data){
    map.set(asset["id"], asset)
  }

  return map
}

export async function getImageAssetMetadata(): Promise<ImageAssetMetadataMap> {
  // const token = useAuthStore.getState().authStatus.session?.access_token
  const token = getToken()
  if(!token) throw new Error("Unauthorized.")
  const response = await http.getPrivate<ImageAssetMetadata[]>('api/assets/processedImages',token)
  console.log("GET METADATA RESONSE:")
  console.log(response)
  const result = ImageAssetMetadataArraySchema.safeParse(response)
  if(!result.success) throw new Error("Response violated contract for request: getAssets-Images.")
  const map: ImageAssetMetadataMap = new Map()
  for(const image of result.data){
    if(map.get(image.configurationId)){
      map.get(image.configurationId)?.push(image)
    }else{
      map.set(image["configurationId"], [image])
    }
  }

  return map  
}