import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function configPlugin(fastify: FastifyInstance) {
  // TODO: fastify.decorate("config", ...)
}

export default fp(configPlugin)

declare module 'fastify' {
  interface FastifyInstance {
    config: unknown
  }
}
