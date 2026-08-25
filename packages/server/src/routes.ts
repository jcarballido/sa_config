import type { FastifyInstance } from 'fastify'
import { and, asc, eq } from 'drizzle-orm'
// import { db } from './db.js'
// import { assets } from './schema.js'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import z from 'zod'
import { supabase } from './supabase/supabase.js'
export async function registerRoutes(app: FastifyInstance) {
  app.get("/test",async(request,reply) => {
  const S3 = new S3Client({
    region: "auto",
    endpoint:process.env.R2_ENDPOINT!,
    credentials:{
      accessKeyId:process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey:process.env.R2_SECRET_ACCESS_KEY!
    }
  })
  console.log(
    await getSignedUrl(
      S3,
      new GetObjectCommand({ Bucket: "products", Key: "small/cad/SADIA17-B-CC.glb" }),
      { expiresIn: 3600 },
    ),
  );
})

app.post("/login/requestAccess", async(request,reply) => {
    console.log("Request: requestMagicLink")
    console.log(request.body)
    const AccessRequest = z.object({email: z.string()})
    const body = AccessRequest.safeParse(request.body)
    if(body.error){
      console.log("error parsing request")
      return {
        status:"error",
        data:null,
        error:{
          code:"LINK REQUEST VIOLATED CONTRACT",
          message:"The request was not formatted correctly."
        }
      }
    }
    const { email } = body.data
    const allowedEmails: string[] = process.env.ALLOWED_EMAIL_LIST
      ? process.env.ALLOWED_EMAIL_LIST.split(",").map(allowedEmail => allowedEmail.trim())
      : []
    if(!allowedEmails.includes(email)){
      console.log("EMAIL IS NOT WHITELISTED")
      return {
        status:"error",
        data:null,
        error:{
          code:"EMAIL IS NOT WHITE LISTED",
          message:"Email provided is not allowed a magic link."
        }
      }
    }

    try {
      console.log("Attempting to send to supabase")
      await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'http://localhost:5173',
        }
      })
      console.log("Supabase email request sent.")      
    } catch (error) {
      console.log("Error sending to supabase")
      console.log(error)
    }

    return {
      status:"success",
      data:{requestApproved:true},
      error:null
    }

    // console.log("RESULT FROM MAGIC LINK REQUEST:")
    // console.log(JSON.stringify(response))

    // return {
    //   status:"Request for magic link processed.",
    // }
  })

  // app.get('/api/assets', async (request, reply) => {
  //   const type = (request.query as { type?: string }).type
  //   const rows = await db
  //     .select({
  //       id: assets.id,
  //       name: assets.name,
  //       type: assets.type,
  //       format: assets.format,
  //       mime: assets.mime,
  //       size: assets.size,
  //       width: assets.width,
  //       height: assets.height,
  //       createdAt: assets.createdAt,
  //     })
  //     .from(assets)
  //     .where(type ? eq(assets.type, type) : undefined)
  //     .orderBy(asc(assets.createdAt))
  //   return reply.send({ assets: rows })
  // })

  // app.get('/api/assets/:id', async (request, reply) => {
  //   const { id } = request.params as { id: string }
  //   const rows = await db.select().from(assets).where(eq(assets.id, id)).limit(1)
  //   if (rows.length === 0) return reply.code(404).send({ error: 'asset not found' })
  //   return reply.send(rows[0])
  // })

  // app.get('/api/assets/:id/file', async (request, reply) => {
  //   const { id } = request.params as { id: string }
  //   const rows = await db.select().from(assets).where(eq(assets.id, id)).limit(1)
  //   if (rows.length === 0) return reply.code(404).send({ error: 'asset not found' })

  //   const asset = rows[0]
  //   reply.header('Cache-Control', 'public, max-age=3600')
  //   try {
  //     return await reply.sendFile(`${asset.id}.${asset.format}`)
  //   } catch {
  //     return reply.code(404).send({ error: 'file missing on disk' })
  //   }
  // })

  return app
}
