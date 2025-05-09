import { AttributeSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.delete(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Attribute"],
        operationId: "Delete attribute",
        description: "Deletes an attribute in the current workspace",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
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

      return fastify.prisma.$transaction(async (prisma) => {
        await prisma.attributeValue.deleteMany({
          where: {
            attributeId: id,
          },
        })
        const attribute = await prisma.attribute.delete({
          where: {
            id,
            workspace: {
              id: workspaceId,
            },
          },
        })

        return attribute
      })
    },
  )
}
