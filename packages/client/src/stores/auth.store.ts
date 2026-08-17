import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'

type AuthStatus = {
  status: 'loading' | 'unauthenticated' | 'authenticated'
  session: Session | null
  user: User | null
}

type AuthStore = {
  auth: AuthStatus
  setAuthStatus: (auth: AuthStatus) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  auth: { status: 'loading', session: null, user: null },
  setAuthStatus: (auth) => set({ auth }),
}))