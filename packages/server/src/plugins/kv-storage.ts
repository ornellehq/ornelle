import type { FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"
import type { Storage } from "unstorage"
import { createStorage } from "unstorage"
import redisDriver from "unstorage/drivers/redis"
import env from "~/env"

declare module "fastify" {
  interface FastifyInstance {
    kvStorage: Storage
  }
}

export const kvStorageClient = createStorage({
  ...(env.KvStorageOptions?.driver === "redis"
    ? { driver: redisDriver({ url: env.KvStorageOptions.url }) }
    : {}),
})

export interface KvStorageOptions {
  options?:
    | {
        driver: "redis"
        url: string
      }
    | {
        driver: "vercelKV"
      }
}

const kvStorage: FastifyPluginAsync<KvStorageOptions> = async (fastify) => {
  fastify.decorate("kvStorage", kvStorageClient)
}

const kvStoragePlugin = fp(kvStorage, "4.x")

export default kvStoragePlugin
