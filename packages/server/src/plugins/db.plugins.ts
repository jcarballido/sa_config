import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function dbPlugin(fastify: FastifyInstance) {
  // TODO: fastify.decorate("db", ...)
}

export default fp(dbPlugin)

declare module 'fastify' {
  interface FastifyInstance {
    db: unknown
  }
}
