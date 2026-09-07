import { useAuthStore } from "../stores/auth.store";
import http from "./client";
import { Assets } from "./types";

export async function getAssests(): Promise<Assets>{
  const token = useAuthStore.getState().authStatus.session?.access_token
  if(!token) throw new Error("Unauthorized.")
  const response = await http.getPrivate<Assets>('api/assets/assets',token)
  const result = Assets.safeParse(response)
  if(!result.success) throw new Error("Response violated contract for request: getAssets.")
  console.log("ASSET DATA:")
  console.log(result.data)
  return result.data
}