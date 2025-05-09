import { WorkspaceSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Workspace"],
        operationId: "Update workspace",
        description: "Updates the current workspace",
        body: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            url: {
              type: "string",
            },
            logo: {
              type: "object",
              required: ["base64", "name", "mime", "size"],
              properties: {
                base64: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                mime: {
                  type: "string",
                },
                size: {
                  type: "number",
                },
              },
            },
          },
        },
        response: {
          200: WorkspaceSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { name, url, logo } = request.body

      const workspace = await fastify.prisma.workspace.findUnique({
        where: {
          id: workspaceId,
        },
      })

      const file = logo
        ? await fastify.services.file.uploadFile({
            workspaceId,
            fileData: logo,
            ...(workspace?.logoSlug && { previousSlug: workspace.logoSlug }),
          })
        : null

      const updatedWorkspace = await fastify.prisma.workspace.update({
        where: {
          id: workspaceId,
        },
        data: {
          ...(name ? { name } : {}),
          ...(url ? { url } : {}),
          ...(logo && file ? { logoSlug: file.path } : {}),
        },
      })

      return updatedWorkspace
    },
  )
}
