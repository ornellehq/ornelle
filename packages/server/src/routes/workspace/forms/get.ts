import { FormSchemaWithOpenings } from "isomorphic-blocs/src/generated/prisma"
import { FormType } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Form"],
        operationId: "Get forms",
        description: "Returns the current workspace's forms by type",
        querystring: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: Object.keys(FormType) as FormType[],
            },
          },
        },
        response: {
          200: {
            type: "array",
            items: FormSchemaWithOpenings,
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { type } = request.query

      const forms = await fastify.prisma.form.findMany({
        where: {
          workspace: {
            id: workspaceId,
          },
          ...(type ? { type } : {}),
        },
        orderBy: {
          // createdAt: "desc",
          updatedAt: "desc",
        },
        include: {
          openings: true,
        },
      })

      return forms
    },
  )
}
