import { OpeningSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Opening"],
        operationId: "Create opening",
        description: "Creates an opening in the current workspace",
        body: {
          type: "object",
          required: ["title", "description", "role"],
          properties: {
            title: {
              type: "string",
            },
            description: {
              type: "object",
              required: ["html", "json"],
              properties: {
                html: {
                  type: "string",
                },
                json: {
                  type: "object",
                },
              },
            },
            role: {
              type: "string",
            },
            form: {
              type: "string",
            },
          },
        },
        response: {
          200: OpeningSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { title, description, role, form } = request.body
      const opening = await fastify.prisma.opening.create({
        data: {
          title,
          description,
          role: {
            connect: {
              id: role,
            },
          },
          workspace: {
            connect: {
              id: workspaceId,
            },
          },
          ...(form
            ? {
                form: {
                  connect: {
                    id: form,
                  },
                },
              }
            : {}),
        },
      })

      return opening
    },
  )
}
