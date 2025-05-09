export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.delete(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Role"],
        operationId: "Delete role",
        description: "Deletes a role by ID",
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
            description: "Role deleted successfully",
          },
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      const openingsCount = await fastify.prisma.opening.count({
        where: {
          roleId: id,
          workspaceId,
          deletedAt: null,
        },
      })

      if (openingsCount > 0) {
        return reply.conflict(
          `Cannot delete role that is being used by ${openingsCount} opening(s)`,
        )
      }

      await fastify.prisma.role.update({
        where: {
          id,
          workspaceId,
        },
        data: {
          deletedAt: new Date(),
        },
      })

      return reply.status(204).send()
    },
  )
}
