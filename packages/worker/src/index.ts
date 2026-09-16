import { createRemoteJWKSet, jwtVerify } from "jose";

const url = new URL('https://htfjioinsapkjfcoznvm.supabase.co/auth/v1/.well-known/jwks.json')
const JWKS = createRemoteJWKSet(url)
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }
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
    console.log("STORAGE KEY:")
    console.log(storageKey)
    const asset = await env.ASSETS.get(storageKey)
    console.log("ASSET:")
    console.log(asset)
    console.log("ASSET BODY")
    console.log(asset?.body)
    if(!asset){
      return new Response("Not Found",{
        status:404
      })
    }
    return new Response(`${asset.size}`,{
      headers:{
        "Cache-Control":"private, max-age=86400, immutable"
      }
    });
  },
};

