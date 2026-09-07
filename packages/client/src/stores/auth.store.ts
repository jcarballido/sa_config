import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'

type State = {
  authStatus: {status: "authenticated", session: Session, user: User } | {status: "unauthenticated" | "loading" ,session: null, user: null },
  error:string | null,
}

type Action = {
  setAuthStatus: (authStatus: State["authStatus"]) => void
  setAuthError: (description: string | null) => void  
}

export const useAuthStore = create<State&Action>((set) => ({
  authStatus:{
    status: 'loading',
    session: null, 
    user: null,
  },
  error: null,
  setAuthStatus: (auth) => set({ authStatus: auth }),
  setAuthError: (description) => set({error: description})
}))