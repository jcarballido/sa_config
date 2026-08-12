import 'dotenv/config'
import Fastify, { type FastifyInstance } from 'fastify'
import fastifyStatic from '@fastify/static'
import { resolve } from 'node:path'
import { registerRoutes } from './routes.js'
// import configPlugins from './plugins/config.plugins.js'
// import dbPlugins from './plugins/db.plugins.js'
// import queriesPlugins from './plugins/queries.plugins.js'
import servicesPlugins from './plugins/services.plugins.js'
import controllersPlugins from './plugins/controllers.plugins.js'

// export const storageDir =
//   process.env.STORAGE_DIR === undefined
//     ? resolve(import.meta.dirname, '..', 'storage')
//     : resolve(import.meta.dirname, '..', process.env.STORAGE_DIR)

const fastify: FastifyInstance = Fastify({
  logger: true,
})

// fastify.register(configPlugins)
// fastify.register(dbPlugins)
// fastify.register(queriesPlugins)
fastify.register(servicesPlugins)
fastify.register(controllersPlugins)

// fastify.register(fastifyStatic, {
//   root: storageDir,
//   serve: false,
//   prefix: '/api/',
// })

registerRoutes(fastify)

fastify.get('/health', async () => ({ ok: true }))

const port = Number(process.env.PORT ?? 3001)

fastify
  .listen({ port, host: '0.0.0.0' })
  .then(() => fastify.log.info(`server listening on http://localhost:${port}`))
  .catch((err) => {
    console.log("ERROR")
    fastify.log.error(err)
    process.exit(1)
  })
