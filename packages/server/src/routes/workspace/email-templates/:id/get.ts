import { EmailTemplateSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Email template"],
        operationId: "Get email template",
        description: "Return an email template by ID",
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
          200: EmailTemplateSchema,
          404: { $ref: "HttpError" },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      const emailTemplate = await fastify.prisma.emailTemplate.findUnique({
        where: {
          id,
          workspaceId,
          deletedAt: null,
        },
      })

      if (!emailTemplate) {
        throw fastify.httpErrors.notFound("Email template not found")
      }

      return emailTemplate
    },
  )
}
