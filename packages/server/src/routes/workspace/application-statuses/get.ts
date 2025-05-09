import { ApplicationStatusSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["ApplicationStatus"],
        operationId: "Get application statuses",
        description: "Get application statuses for the current workspace",
        response: {
          200: {
            type: "array",
            items: ApplicationStatusSchema,
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace

      const applicationStatuses =
        await fastify.prisma.applicationStatus.findMany({
          where: {
            workspaceId,
          },
          orderBy: {
            createdAt: "asc",
          },
        })

      return applicationStatuses
    },
  )
}
