import { createRemoteJWKSet, decodeProtectedHeader, jwtVerify } from "jose";

const url = new URL('https://htfjioinsapkjfcoznvm.supabase.co/auth/v1/.well-known/jwks.json')
const JWKS = createRemoteJWKSet(url)

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Check auth headers
   const headers = request.headers
   const authHeader = headers.get("authorization")
   if(!authHeader){
    console.log("Missing AUTHORIZATION header")
    return new Response("Unauthorized",{
      status:401
    })
   }
   const [ scheme, token ] = authHeader.split(" ")
    console.log({
      token,
      scheme,
      tokenLength: token.length,
      parts: token.split(".").map(part => part.length),
      startsWith: token.slice(0, 10),
    })

  const header = decodeProtectedHeader(token)

  console.log("JWT header:", header)  
  if(scheme != "Bearer"){
    return new Response("Unauthorized",{
      status:401,
      headers:{
        "Content-Type":"application/json",
        "WWW-Authenticate":"Bearer"
      }
    })
   }
   // Validate auth token
   try {
    const {payload} = await jwtVerify(token, JWKS, {
      issuer: "https://htfjioinsapkjfcoznvm.supabase.co/auth/v1",
      audience: 'authenticated',
    })
    console.log("Payload:")
    console.log(payload)
  } catch (error) {
    console.log("Error verifying token:")
    console.log(error)
    return new Response("Unauthorized",{
      status:401
    })
   }
    // Extract bucket KEY
    const endpoint = new URL(request.url)
    const storageKey = endpoint.pathname.slice(1)
    const asset = await env.ASSETS.get(storageKey)
    console.log("ASSET:")
    console.log(asset)
    if(!asset){
      return new Response("Not Found",{
        status:404
      })
    }
    return new Response(asset.body,{
      headers:{
        "Content-Type":"model/gltf-binary",
        "Cache-Control":"private, max-age=86400, immutable"
      }
    });
  },
};

