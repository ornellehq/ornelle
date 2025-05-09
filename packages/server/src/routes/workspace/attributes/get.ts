import { AttributeSchema } from "isomorphic-blocs/src/generated/prisma"
import { EntityType } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Attribute"],
        operationId: "Get attributes",
        description: "Gets attributes in the current workspace",
        querystring: {
          type: "object",
          required: ["entityTypes"],
          properties: {
            entityTypes: {
              type: "array",
              items: {
                type: "string",
                enum: Object.keys(EntityType) as EntityType[],
              },
            },
          },
        },
        response: {
          200: {
            type: "array",
            items: AttributeSchema,
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { entityTypes } = request.query

      const attributes = await fastify.prisma.attribute.findMany({
        where: {
          entityType: {
            in: entityTypes,
          },
          workspace: {
            id: workspaceId,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      return attributes
    },
  )
}
