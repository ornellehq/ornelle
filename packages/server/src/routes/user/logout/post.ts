import { cookieConfig } from "~/config"
import env from "~/env"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [fastify.authenticate.forUser],
      schema: {
        tags: ["User"],
        operationId: "Log out",
        description: "Log a user out",
        response: {
          200: {
            type: "object",
            required: ["message"],
            properties: {
              status: {
                type: "string",
                enum: ["ok"],
              },
              message: {
                type: "string",
              },
            },
          },
          500: { $ref: "HttpError" },
        },
      },
    },
    async (_, reply) => {
      const expiresNumber = env.UserExpires.match(/\d+/g)?.[0]
      const maxAge = expiresNumber ? Number.parseInt(expiresNumber) : 14
      reply.clearCookie("ats_token", {
        ...cookieConfig,
        maxAge: maxAge * 60 * 60 * 24,
      })
      reply.send({
        status: "ok",
        message: "User logged out",
      })
    },
  )
}
