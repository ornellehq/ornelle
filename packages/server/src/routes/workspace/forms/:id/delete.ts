export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.delete(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Form"],
        operationId: "Delete form",
        description: "Deletes a form by ID",
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
          200: {
            type: "object",
            properties: {
              description: {
                type: "string",
              },
            },
          },
          400: { $ref: "HttpError" },
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      const form = await fastify.prisma.form.findUnique({
        where: {
          id,
          workspace: {
            id: workspaceId,
          },
        },
        include: {
          _count: {
            select: {
              openings: true,
              reviews: true,
            },
          },
        },
      })

      if (form?._count?.openings || form?._count?.reviews) {
        reply.badRequest("Form cannot be deleted because it is still in use.")
        return
      }

      await fastify.prisma.form.delete({
        where: {
          id,
          workspace: {
            id: workspaceId,
          },
        },
      })

      reply.status(200).send({
        description: "Form deleted successfully",
      })
    },
  )
}
