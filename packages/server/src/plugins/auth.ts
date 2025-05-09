import crypto from "node:crypto"
import type { FastifyPluginAsync, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { verify } from "jsonwebtoken"
import env from "~/env"
import type { AuthUser, AuthWorkspace } from "~/types"

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser
    workspace: AuthWorkspace
    // For public apis only
    publicApi: {
      apiFilterFields: string[]
    }
  }

  interface FastifyInstance {
    authenticate: {
      forUser(request: FastifyRequest): void
      forWorkspace(request: FastifyRequest): void
      forPagesService(request: FastifyRequest): void
    }
  }
}

const auth: FastifyPluginAsync<{
  userSecret: string
  workspaceSecret: string
}> = async (fastify, { userSecret, workspaceSecret }) => {
  if (!fastify.hasDecorator("authenticate"))
    fastify.decorate("authenticate", {
      forUser: async (request: FastifyRequest) => {
        const { ats_token } = request.cookies

        if (!ats_token)
          throw fastify.httpErrors.unauthorized("User is not authenticated")

        try {
          const payload = verify(ats_token, userSecret)

          if (typeof payload === "object" && "email" in payload) {
            request.user = { email: payload.email }
          }
        } catch (err) {
          throw fastify.httpErrors.unauthorized("User is not authenticated")
        }
      },
      forWorkspace: async (request: FastifyRequest) => {
        const { authorization } = request.headers
        const token = authorization?.replace("Bearer ", "")

        if (!token)
          throw fastify.httpErrors.unauthorized(
            "User is not authorized to access this workspace",
          )

        try {
          const payload = verify(token, workspaceSecret)
          if (typeof payload === "object" && "id" in payload) {
            request.workspace = {
              id: payload.id,
              profileId: payload.profileId,
            }
          }
        } catch (err) {
          throw fastify.httpErrors.unauthorized(
            "User is not authorized to access this workspace",
          )
        }
      },
      forPagesService: async (request: FastifyRequest) => {
        const timestamp = request.headers["x-timestamp"] as string
        const signature = request.headers["x-signature"] as string
        const source = request.headers["x-source"] as string

        // Check if required headers are present
        if (!timestamp || !signature) {
          throw fastify.httpErrors.unauthorized(
            "Missing authentication headers",
          )
        }

        // Check if source is from our pages service
        if (source !== "career-page") {
          throw fastify.httpErrors.unauthorized("Invalid source")
        }

        // Check if timestamp is recent (within 5 minutes)
        const requestTime = Number.parseInt(timestamp, 10)
        const currentTime = Date.now()
        const fiveMinutesInMs = 5 * 60 * 1000

        if (
          Number.isNaN(requestTime) ||
          currentTime - requestTime > fiveMinutesInMs
        ) {
          throw fastify.httpErrors.unauthorized("Request expired")
        }

        try {
          // For HMAC signature checking, we can't consume the stream
          // Instead, we'll validate using just the timestamp
          // This approach lets the route handler consume the stream

          // Create payload with only timestamp (no form entries)
          const payload = JSON.stringify({
            timestamp: requestTime,
          })

          // Create HMAC using SHA-256 algorithm
          const hmac = crypto.createHmac("sha256", env.Keys.pages)
          hmac.update(payload)
          const expectedSignature = hmac.digest("base64")

          // Compare signatures
          if (signature !== expectedSignature) {
            throw fastify.httpErrors.unauthorized("Invalid signature")
          }
        } catch (err) {
          fastify.log.error(err)
          throw fastify.httpErrors.unauthorized("Authentication failed")
        }
      },
    })
}

const authPlugin = fp(auth, {
  fastify: "4.x",
  name: "auth",
})

export default authPlugin
