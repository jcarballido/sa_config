import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function queriesPlugin(fastify: FastifyInstance) {
  // TODO: fastify.decorate("assetQuery", ...)
}

export default fp(queriesPlugin)

declare module 'fastify' {
  interface FastifyInstance {
    assetQuery: unknown
  }
}
