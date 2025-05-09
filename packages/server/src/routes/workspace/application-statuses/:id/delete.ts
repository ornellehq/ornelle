export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.delete(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["ApplicationStatus"],
        operationId: "Delete application status",
        description: "Delete an application status by id",
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
            description: "Application status deleted successfully",
          },
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      try {
        // Check if the application status exists
        const existingStatus = await fastify.prisma.applicationStatus.findFirst(
          {
            where: {
              id,
              workspaceId,
            },
          },
        )

        if (!existingStatus) {
          return reply.notFound("Application status not found")
        }

        // Don't allow deleting out-of-the-box statuses
        if (existingStatus.isOutOfTheBox) {
          return reply.forbidden(
            "Cannot delete out-of-the-box application statuses",
          )
        }

        // Check if any applications are using this status
        const applicationsUsingStatus = await fastify.prisma.application.count({
          where: {
            statusId: id,
            workspaceId,
          },
        })

        if (applicationsUsingStatus > 0) {
          return reply.conflict(
            `Cannot delete status that is being used by ${applicationsUsingStatus} application(s)`,
          )
        }

        // Delete the application status
        await fastify.prisma.applicationStatus.delete({
          where: {
            id,
            workspaceId,
          },
        })

        return reply.code(204).send()
      } catch (error) {
        request.log.error(error)
        return reply.internalServerError("Failed to delete application status")
      }
    },
  )
}
