import {
  AttributeConfigurationSchema,
  AttributeSchema,
} from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Attribute"],
        operationId: "Update attribute",
        description: "Updates an attribute in the current workspace",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },
        body: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            configuration: AttributeConfigurationSchema,
          },
        },
        response: {
          200: AttributeSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params
      const { name, configuration } = request.body

      const attribute = await fastify.prisma.attribute.update({
        where: {
          id,
          workspace: {
            id: workspaceId,
          },
        },
        data: {
          ...(name ? { name } : {}),
          ...(configuration ? { configuration: configuration as object } : {}),
        },
      })

      return attribute
    },
  )
}
