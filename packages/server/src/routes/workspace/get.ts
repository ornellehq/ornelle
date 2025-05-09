import { WorkspaceSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Workspace"],
        operationId: "Get workspace",
        description: "Returns the current workspace",
        response: {
          200: WorkspaceSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace

      const workspace = await fastify.prisma.workspace.findUnique({
        where: {
          id: workspaceId,
        },
      })

      return workspace
    },
  )
}
