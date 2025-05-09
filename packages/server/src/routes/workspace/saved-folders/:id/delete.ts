export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.delete(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["SavedFolder"],
        operationId: "Delete saved folder",
        description: "Delete a saved folder by id",
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
            description: "Saved folder deleted successfully",
          },
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId, profileId } = request.workspace
      const { id } = request.params

      try {
        // Check if the saved folder exists and belongs to the user
        const existingFolder = await fastify.prisma.savedFolder.findFirst({
          where: {
            id,
            workspaceId,
            creatorId: profileId, // Only creator can delete
          },
        })

        if (!existingFolder) {
          return reply.notFound(
            "Saved folder not found or you don't have permission to delete it",
          )
        }

        // Delete the saved folder
        // Note: This will also cascade delete the folder-saved item relationships,
        // but not the saved items themselves
        await fastify.prisma.savedFolder.delete({
          where: {
            id,
          },
        })

        return reply.status(204).send()
      } catch (error) {
        fastify.log.error(error)
        return reply.internalServerError("Failed to delete saved folder")
      }
    },
  )
}
