import { ProfileSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Profile"],
        operationId: "Update profile",
        description: "Updates the current user's profile",
        body: {
          type: "object",
          properties: {
            displayName: {
              type: "string",
            },
            picture: {
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
          200: ProfileSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId, profileId } = request.workspace
      const { displayName, picture } = request.body

      // Verify profile belongs to workspace
      const existingProfile = await fastify.prisma.profile.findFirst({
        where: {
          id: profileId,
          workspaceId,
        },
      })

      if (!existingProfile) {
        throw fastify.httpErrors.notFound("Profile not found")
      }

      const file = picture
        ? await fastify.services.file.uploadFile({
            workspaceId,
            entityId: profileId,
            entityType: "profiles",
            fileData: picture,
            previousSlug: existingProfile.pictureSlug,
          })
        : null

      // Update profile with new data
      const profile = await fastify.prisma.profile.update({
        where: {
          id: profileId,
        },
        data: {
          ...(displayName ? { displayName } : {}),
          ...(picture && file ? { pictureSlug: file.slug } : {}),
        },
      })

      return profile
    },
  )
}
