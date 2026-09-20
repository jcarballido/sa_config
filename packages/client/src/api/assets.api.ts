import { useAuthStore } from "../stores/auth.store";
import http from "./client";
import { type AssetMetadata, AssetMetadataArraySchema } from "./types";

type AssetMetadataMap = Map<AssetMetadata['id'],AssetMetadata>

export async function getAssestMetadata(): Promise<AssetMetadataMap>{
  const token = useAuthStore.getState().authStatus.session?.access_token
  if(!token) throw new Error("Unauthorized.")
  const response = await http.getPrivate<AssetMetadata[]>('api/assets/assets',token)
  const result = AssetMetadataArraySchema.safeParse(response)
  if(!result.success) throw new Error("Response violated contract for request: getAssets.")
  const map: AssetMetadataMap = new Map()
  for(const asset of result.data){
    map.set(asset["id"], asset)
  }

  return map
}