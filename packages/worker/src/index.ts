import { createRemoteJWKSet, jwtVerify } from "jose";

const url = new URL('https://htfjioinsapkjfcoznvm.supabase.co/auth/v1/.well-known/jwks.json')
const JWKS = createRemoteJWKSet(url)
console.log("JWKS successful")

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Validate Request
   console.log('REQUEST:')
   const h = request.headers
   const token = h.get("authorization")?.replace("Bearer ","")
   console.log("TOKEN RESULT:")
   console.log(token)
   if(!token){
    console.log("AUTHORIZATION:")
    console.log(h.get("authorization"))
    return new Response("MISSING HEADERS")
   }
   const { payload } = await jwtVerify(token, JWKS)
   console.log("PAYLOAD")
   if(!payload) {
    console.log("PAYLOAD NOT FOUND")
    return new Response("UNAUTHORIZED")
   }
    /*
    // Extract bucket KEY
    const endpoint = new URL(request.url)
    const key = endpoint.pathname.slice(1)
    // Get asset from extracted KEY
    const asset = await env.ASSETS.get(key)
    console.log("ASSET:")
    console.log(asset)
    if(!asset){
      return new Response("This asset does not exist")
    }
    */
    return new Response(payload.sub);
  },
};

// products/cad/body/small/
// https://dash.cloudflare.com/8396daa9c3a2dd6c46f97e2dc26b591a/r2/default/buckets/products/objects/cad%2Fbody%2Fsmall%2Fc94dd9132ae6c705e883e81b703faeec6322ebc3ad88631c6c4bf154fb348866.glb/details?prefix=cad%2Fbody%2Fsmall%2F