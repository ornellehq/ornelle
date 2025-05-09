import { RoleSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Role"],
        operationId: "Create role",
        description: "Creates a role in the current workspace",
        body: {
          type: "object",
          required: ["title", "description"],
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
          },
        },
        response: {
          200: RoleSchema,
        },
      },
    },
    async (request) => {
      const { id } = request.workspace
      const { title, description } = request.body
      const role = await fastify.services.role.createRole({
        workspace: {
          connect: {
            id,
          },
        },
        title,
        description,
      })

      return role
    },
  )
}
