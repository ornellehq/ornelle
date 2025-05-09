export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.delete(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Opening"],
        operationId: "Delete opening",
        description: "Deletes an opening by ID",
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
          204: {
            type: "null",
            description: "Opening deleted successfully",
          },
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      await fastify.prisma.opening.update({
        where: {
          id,
          workspaceId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      })

      return reply.status(204).send()
    },
  )
}
