import { ProfileSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Profile"],
        operationId: "Get profiles",
        description: "Returns the current workspace's profiles",
        response: {
          200: {
            type: "array",
            items: {
              ...ProfileSchema,
              required: [...ProfileSchema.required, "user"],
              properties: {
                ...ProfileSchema.properties,

                user: {
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
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace

      const profiles = await fastify.prisma.profile.findMany({
        where: {
          workspace: {
            id: workspaceId,
          },
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      return profiles
    },
  )
}
