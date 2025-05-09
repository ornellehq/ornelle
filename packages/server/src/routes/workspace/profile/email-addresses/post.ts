import { EmailAddressSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/workspace/profile/email-addresses",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Profile"],
        operationId: "Create email address",
        description: "Creates an email address for the current user's profile",
        body: {
          type: "object",
        },
        response: {
          200: EmailAddressSchema,
        },
      },
    },
    async (request) => {
      const { profileId, id: workspaceId } = request.workspace

      const emailAddress = await fastify.services.email.generateEmailAddress({
        profileId,
        workspaceId,
      })

      return emailAddress
    },
  )
}
