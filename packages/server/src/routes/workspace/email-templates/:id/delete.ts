export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.delete(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Email template"],
        operationId: "Delete email template",
        description: "Deletes an email template from the current workspace",
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
            description: "Email template deleted successfully",
          },
          404: { $ref: "HttpError" },
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      // Delete the email template
      await fastify.prisma.emailTemplate.update({
        where: {
          id,
          workspaceId,
        },
        data: {
          deletedAt: new Date(),
        },
      })

      reply.code(204).send()
    },
  )
}
