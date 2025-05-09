import { UserSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["User"],
        operationId: "Verify authentication",
        description:
          "Verifies email address ownership and authenticates user for further API actions",
        querystring: {
          type: "object",
          required: ["email", "code"],
          properties: {
            email: {
              description: "Email address wanting to log in",
              type: "string",
              format: "email",
              examples: ["email@email.com"],
            },
            code: {
              type: "string",
              description: "Secure code sent to user's email address",
            },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["meta"],
            properties: {
              data: {
                type: "object",
                required: ["email"],
                properties: UserSchema.properties,
              },
              meta: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                  },
                },
              },
            },
          },
          400: { $ref: "HttpError" },
          500: { $ref: "HttpError" },
        },
      },
      config: {
        rateLimit: {
          keyGenerator: (request) => {
            const { email } = request.query as { email: string }
            return `fastify-rate-limit:${email}`
          },
          timeWindow: "10 minutes",
          max: 20,
        },
      },
    },
    async (request, reply) => {
      const { services } = fastify
      const { email, code } = request.query
      const res = await services.user.authenticateUser({
        email: email.toLowerCase(),
        code,
      })

      if ("status" in res) throw res

      await services.auth.attachUserCookie({ email }, reply)

      return {
        data: res.user ?? undefined,
        meta: { email },
      }
    },
  )
}
