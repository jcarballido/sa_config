import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: 'implicit',
      detectSessionInUrl: true,
    }
  }
)

supabase.auth.onAuthStateChange((event, session) => {
  console.log("STATE CHANGE")
  console.log("EVENT: ", event)
  if(session) {
      // useAuthStore.getState().setAuthStatus({status:"authenticated",session: session, user: session.user})
  }else{
    // useAuthStore.getState().setAuthStatus({status:"unauthenticated",session: null,user:null})
  }
})
