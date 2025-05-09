import { EmailTemplateSchema } from "isomorphic-blocs/src/generated/prisma"
import { EmailTemplateType } from "isomorphic-blocs/src/prisma"

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
        operationId: "Get email templates",
        description: "Gets email templates in the current workspace",
        querystring: {
          type: "object",
          properties: {
            emailType: {
              type: "string",
              enum: Object.keys(EmailTemplateType) as EmailTemplateType[],
            },
          },
        },
        response: {
          200: {
            type: "array",
            items: EmailTemplateSchema,
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { emailType } = request.query

      const emailTemplates = await fastify.prisma.emailTemplate.findMany({
        where: {
          workspaceId,
          deletedAt: null,
          ...(emailType ? { type: emailType } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return emailTemplates
    },
  )
}
