import { ViewSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["View"],
        operationId: "Update view",
        description: "Update a view by ID",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },
        body: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            config: {},
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
      const { name, config } = request.body
      const view = await fastify.prisma.view.update({
        where: {
          workspaceId,
          id,
        },
        data: {
          ...(name ? { name } : {}),
          ...(config ? { config } : {}),
        },
      })

      return view
    },
  )
}
