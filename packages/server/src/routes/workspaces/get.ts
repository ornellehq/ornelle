import { WorkspaceSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [fastify.authenticate.forUser],
      schema: {
        tags: ["Workspace"],
        operationId: "Get workspaces",
        description: "Fetches the current user's workspaces",
        response: {
          200: {
            type: "array",
            items: WorkspaceSchema,
          },
          503: {
            type: "object",
          },
        },
      },
    },
    async (request) => {
      const { email } = request.user

      return fastify.prisma.workspace.findMany({
        where: {
          members: {
            some: {
              user: {
                email,
              },
            },
          },
        },
      })
    },
  )
}

// Can a combination of the characters from `Date.now().toString(36)` and the characters in the workspace name be used to generate the unique id?
