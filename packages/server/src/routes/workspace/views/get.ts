import { ViewSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["View"],
        operationId: "Get views",
        description: "Returns the current workspace's views",
        response: {
          200: {
            type: "array",
            items: ViewSchema,
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const views = await fastify.prisma.view.findMany({
        where: {
          workspaceId,
        },
      })

      return views
    },
  )
}
