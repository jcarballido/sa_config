// Placeholder endpoint — replace with POST /api/auth/magic-link { email }
// The server validates the email against the whitelist, then calls
// supabase.auth.signInWithOtp. The client currently resolves immediately;
// only a thrown error (network failure) should surface in the UI.
export async function sendMagicLink(email: string): Promise<void> {
  const response = await fetch('api/login/requestAccess',{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({email: email})
  })
  if(!response.ok) throw new Error("Error failed.")
}

