import auth from "@fastify/auth"
import autoload from "@fastify/autoload"
import cookie from "@fastify/cookie"
import cors from "@fastify/cors"
import multipart from "@fastify/multipart"
import sensible from "@fastify/sensible"
import fastifyStatic from "@fastify/static"
import swagger from "@fastify/swagger"
import type { FastifyInstance } from "fastify"
import "make-promises-safe"
import path from "node:path"
import { rootDir } from "./config"
import env from "./env"
import authPlugin from "./plugins/auth"
import emailPlugin from "./plugins/email"
import type { KvStorageOptions as TKvStorageOptions } from "./plugins/kv-storage"
import kvStoragePlugin from "./plugins/kv-storage"
import prismaPlugin from "./plugins/prisma"
import servicePlugin from "./plugins/services"

const { EmailServiceConfig, KvStorageOptions, NODE_ENV } = env
const isDevelopment = NODE_ENV === "development"
const load = (app: FastifyInstance) => {
  app.register(auth)
  app.register(cookie)
  app.register(cors, {
    origin: true,
    credentials: true,
    // allowedHeaders: ["*"],
    exposedHeaders: [
      "X-Has-Next-Page",
      "X-End-Cursor",
      "X-Page-Size",
      "X-Next",
      "X-Previous",
    ],
  })
  app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 1, // Limit to one file per request
    },
  })
  app.register(fastifyStatic, {
    root: path.resolve(rootDir, "../..", "uploads"),
    // prefix: "/files/",
  })

  // if (!isDevelopment)
  //   app.register(rateLimit, {
  //     max: 240,
  //     timeWindow: "1 minute",
  //   })
  app.register(sensible, {
    sharedSchemaId: "HttpError",
  })

  if (isDevelopment) {
    app.register(swagger, {
      openapi: {
        openapi: "3.0.0",
        components: {},
      },
    })

    app.register(require("@scalar/fastify-api-reference"), {
      routePrefix: "/documentation",
      configuration: {
        theme: "purple",
      },
    })
  }

  app.register(authPlugin, {
    userSecret: env.UserSecret,
    workspaceSecret: env.WorkspaceSecret,
  })

  app.register(emailPlugin, {
    providerName: EmailServiceConfig.providerName,
    providerOptions: EmailServiceConfig.providerConfig,
    domain: env.DOMAIN,
    subdomain: EmailServiceConfig.subdomain,
  })
  // @ts-ignore
  app.register(kvStoragePlugin, {
    options: (KvStorageOptions ??
      {}) as unknown as TKvStorageOptions["options"],
  })

  app.register(prismaPlugin, {})

  app.register(servicePlugin, {})

  app.register(autoload, {
    dir: path.join(__dirname, "routes"),
    // matchFilter: (path) => path.includes("/v1/"),
  })

  if (isDevelopment)
    app.get("/documentation/json", () => {
      return app.swagger()
    })
}

export default load
