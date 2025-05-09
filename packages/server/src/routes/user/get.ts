import { UserSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["User"],
        operationId: "Get current User",
        description: "Returns the currently authenticated user, if any",
        response: {
          200: {
            type: "object",
            required: ["data"],
            properties: {
              data: UserSchema,
              meta: {
                type: "object",
                required: ["email", "filesBaseUrl"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  filesBaseUrl: {
                    type: "string",
                  },
                },
              },
            },
          },
          404: {
            type: "object",
            required: ["meta"],
            properties: {
              meta: {
                type: "object",
                required: ["email", "filesBaseUrl"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  filesBaseUrl: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      preValidation: [fastify.authenticate.forUser],
    },
    async (request, reply) => {
      const { email } = request.user
      const user = await fastify.services.user.findUser({
        email: request.user.email,
        deletedAt: null,
      })

      const meta = {
        email,
        filesBaseUrl: fastify.services.file.getFileUrl({ path: "" }),
      }

      reply.status(user ? 200 : 404).send({
        data: user,
        meta,
      })
    },
  )
}
