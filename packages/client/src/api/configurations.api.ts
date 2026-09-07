import { useAuthStore } from "../stores/auth.store";
import http from "./client";
import { Configurations } from "./types";

export async function getConfigurations(): Promise<Configurations>{
  const token = useAuthStore.getState().authStatus.session?.access_token
  if(!token) throw new Error("Unauthorized.")
  const response = await http.getPrivate<Configurations>('api/assets/configurations',token)
  const result = Configurations.safeParse(response)
  if(!result.success) throw new Error("Response violated contract for request: getConfigurations.")
  console.log("DATA:")
  console.log(result.data)
  return result.data
}