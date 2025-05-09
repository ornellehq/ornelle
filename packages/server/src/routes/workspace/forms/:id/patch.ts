import {
  FormFieldsSchema,
  FormSchemaWithOpenings,
} from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Form"],
        operationId: "Update form",
        description: "Updates a form in the current workspace",
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
          required: [],
          properties: {
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            openings: {
              type: "array",
              items: {
                type: "object",
                required: ["operation", "id"],
                properties: {
                  id: {
                    type: "string",
                  },
                  operation: {
                    type: "string",
                    enum: ["disconnect", "connect"],
                  },
                },
              },
            },
            fields: FormFieldsSchema,
          },
        },
        response: {
          200: FormSchemaWithOpenings,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      const { title, description = "", openings, fields } = request.body

      const form = await fastify.prisma.form.update({
        where: {
          id,
          workspace: {
            id: workspaceId,
          },
        },
        data: {
          ...(title ? { name: title } : {}),
          ...(description ? { description } : {}),
          ...(fields
            ? { content: { json: fields, version: "1" } as object }
            : {}),
          ...(openings
            ? {
                openings: openings.reduce(
                  (acc, opening) => {
                    return {
                      disconnect:
                        opening.operation === "disconnect"
                          ? [...acc.disconnect, { id: opening.id }]
                          : acc.disconnect,
                      connect:
                        opening.operation === "connect"
                          ? [...acc.connect, { id: opening.id }]
                          : acc.connect,
                    }
                  },
                  { disconnect: [], connect: [] } as {
                    disconnect: { id: string }[]
                    connect: { id: string }[]
                  },
                ),
              }
            : {}),
        },
        include: {
          openings: true,
        },
      })

      return form
    },
  )
}
