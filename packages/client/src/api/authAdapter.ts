import { useAuthStore } from "../stores/auth.store"

export const getToken = () => {
  return useAuthStore.getState().authStatus.session?.access_token ?? null
}