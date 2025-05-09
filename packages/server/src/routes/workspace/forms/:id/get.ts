import { FormSchemaWithOpenings } from "isomorphic-blocs/src/generated/prisma"

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
        operationId: "Get form",
        description: "Return a form by ID",
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
          200: FormSchemaWithOpenings,
          404: { $ref: "HttpError" },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      return await fastify.prisma.form.findUnique({
        where: {
          id,
          workspace: {
            id: workspaceId,
          },
        },
        include: {
          openings: true,
        },
      })
    },
  )
}
