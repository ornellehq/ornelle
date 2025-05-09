import type { FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"
import type { DB } from "isomorphic-blocs/src/kysely"
import { PrismaClient } from "isomorphic-blocs/src/prisma"
import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"

export const prismaClient = new PrismaClient()

export const kyselyClient = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      // your database configuration
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient
    kysely: Kysely<DB>
  }
}

const prisma: FastifyPluginAsync<object> = async (fastify) => {
  fastify.decorate("prisma", prismaClient)
  fastify.decorate("kysely", kyselyClient)
}

const prismaPlugin = fp(prisma, {
  fastify: "4.x",
  name: "prisma",
})

export default prismaPlugin
