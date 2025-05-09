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
        operationId: "Get view",
        description: "Return a view by ID",
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
          200: ViewSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params
      const view = await fastify.prisma.view.findUnique({
        where: {
          workspaceId,
          id,
        },
      })

      if (!view) return fastify.httpErrors.notFound()

      return view
    },
  )
}
