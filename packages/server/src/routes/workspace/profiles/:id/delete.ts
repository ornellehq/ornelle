import { ProfileSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.delete(
    "/",
    {
      schema: {
        tags: ["Profile"],
        operationId: "Delete profile by ID",
        description:
          "Deletes a user profile by ID and associated email addresses",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
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

      // Deactivate profile and email addresses in a transaction
      const profile = await fastify.prisma.$transaction(async (prisma) => {
        // First deactivate the profile
        const profile = await prisma.profile.update({
          where: {
            id: profileId,
            workspaceId: workspace.id,
          },
          data: {
            deactivated: new Date(),
          },
        })

        // Then deactivate all associated email addresses
        await prisma.emailAddress.updateMany({
          where: {
            profileId,
            workspaceId: workspace.id,
          },
          data: {
            deletedAt: new Date(),
            isActive: false,
          },
        })

        return profile
      })

      return profile
    },
  )
}
