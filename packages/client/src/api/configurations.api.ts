import { useAuthStore } from "../stores/auth.store";
import http from "./client";
import { ConfigurationsArraySchema, type Configuration } from "./types";

type ConfigurationsMap = Map<string,Configuration>

export async function getConfigurations(): Promise<ConfigurationsMap>{
  const token = useAuthStore.getState().authStatus.session?.access_token
  if(!token) throw new Error("Unauthorized.")
  const response = await http.getPrivate<Configuration[]>('api/assets/configurations',token)
  const result = ConfigurationsArraySchema.safeParse(response)
  if(!result.success) throw new Error("Response violated contract for request: getConfigurations.")
  const map: ConfigurationsMap = new Map()
  for(const config of result.data){
    const key = config["signature"].join("-")
    map.set(key, config)
  }
  return map
}