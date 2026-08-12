import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function controllersPlugin(fastify: FastifyInstance) {
  // TODO: fastify.decorate("controllers", ...)
}

export default fp(controllersPlugin)

declare module 'fastify' {
  interface FastifyInstance {
    controllers: unknown
  }
}
