import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function servicesPlugin(fastify: FastifyInstance) {
  // TODO: fastify.decorate("services", ...)
}

export default fp(servicesPlugin)

declare module 'fastify' {
  interface FastifyInstance {
    services: unknown
  }
}
