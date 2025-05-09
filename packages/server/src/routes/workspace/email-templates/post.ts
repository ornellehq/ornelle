import {
  EmailTemplateSchema,
  rteValueSchema,
} from "isomorphic-blocs/src/generated/prisma"
import { EmailTemplateType } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Email template"],
        operationId: "Create email template",
        description: "Creates an email template in the current workspace",
        body: {
          type: "object",
          required: ["name", "subject", "emailType"],
          properties: {
            name: {
              type: "string",
            },
            description: {
              type: "string",
            },
            subject: {
              type: "string",
            },
            content: rteValueSchema,
            emailType: {
              type: "string",
              enum: Object.keys(EmailTemplateType) as EmailTemplateType[],
            },
          },
        },
        response: {
          200: EmailTemplateSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace

      const {
        name,
        description = "",
        subject,
        content,
        emailType,
      } = request.body
      const emailTemplate = await fastify.prisma.emailTemplate.create({
        data: {
          name,
          type: emailType,
          description,
          content,
          subject,
          workspace: {
            connect: {
              id: workspaceId,
            },
          },
        },
      })

      return emailTemplate
    },
  )
}
