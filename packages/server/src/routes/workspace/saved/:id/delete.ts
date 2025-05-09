export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.delete(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Saved"],
        operationId: "Delete saved item",
        description: "Delete a saved item by id",
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
            description: "Saved item deleted successfully",
          },
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId, profileId } = request.workspace
      const { id } = request.params

      try {
        // Check if the saved item exists and belongs to the user
        const existingSavedItem = await fastify.prisma.saved.findFirst({
          where: {
            id,
            workspaceId,
            creatorId: profileId, // Only creator can delete
          },
        })

        if (!existingSavedItem) {
          return reply.notFound(
            "Saved item not found or you don't have permission to delete it",
          )
        }

        // Delete the saved item
        await fastify.prisma.saved.delete({
          where: {
            id,
          },
        })

        return reply.status(204).send()
      } catch (error) {
        fastify.log.error(error)
        return reply.internalServerError("Failed to delete saved item")
      }
    },
  )
}
