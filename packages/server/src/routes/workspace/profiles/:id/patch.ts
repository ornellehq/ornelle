import { ProfileSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      schema: {
        tags: ["Profile"],
        operationId: "Update profile by ID",
        description: "Updates a user profile by ID",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        body: {
          type: "object",
          properties: {
            permissionId: { type: "string" },
            activate: {
              type: "boolean",
            },
          },
        },
        response: {
          200: ProfileSchema,
        },
      },
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
    },
    async (request) => {
      const { id: profileId } = request.params as { id: string }
      const { workspace } = request
      const { permissionId, activate } = request.body

      return fastify.prisma.$transaction(async (prisma) => {
        const profile = await prisma.profile.update({
          where: {
            id: profileId,
            workspaceId: workspace.id,
          },
          data: {
            ...(permissionId && { permissionId }),
            ...(activate && { deactivated: null }),
          },
        })

        if (activate) {
          await prisma.emailAddress.updateMany({
            where: {
              profileId,
              workspaceId: workspace.id,
            },
            data: {
              deletedAt: null,
              isActive: true,
            },
          })
        }

        return profile
      })
    },
  )
}
