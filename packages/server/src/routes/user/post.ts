import { UserSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [fastify.authenticate.forUser],
      schema: {
        tags: ["User"],
        operationId: "Create a User",
        description: "Creates a new user",
        body: {
          type: "object",
          required: ["firstName"],
          properties: {
            firstName: {
              type: "string",
            },
          },
        },
        response: {
          200: UserSchema,
        },
      },
    },
    async (request, reply) => {
      const { email } = request.user
      const { firstName } = request.body
      if (firstName.length < 2)
        return reply.badRequest("Name cannot be less than 2 characters")

      const user = await fastify.services.user.createUser({
        firstName,
        email,
      })

      return user
    },
  )
}
