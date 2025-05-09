import {
  EmailTemplateSchema,
  rteValueSchema,
} from "isomorphic-blocs/src/generated/prisma"
import { EmailTemplateType } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Email template"],
        operationId: "Update email template",
        description: "Updates an email template in the current workspace",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },
        body: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            subject: {
              type: "string",
            },
            description: {
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
          404: { $ref: "HttpError" },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params
      const { name, description, subject, content, emailType } = request.body

      // First check if the email template exists
      const existingTemplate = await fastify.prisma.emailTemplate.findUnique({
        where: {
          id,
          workspaceId,
        },
      })

      if (!existingTemplate) {
        throw fastify.httpErrors.notFound("Email template not found")
      }

      // Update the email template
      const emailTemplate = await fastify.prisma.emailTemplate.update({
        where: {
          id,
          workspaceId,
        },
        data: {
          ...(name !== undefined ? { name } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(subject !== undefined ? { subject } : {}),
          ...(content !== undefined ? { content } : {}),
          ...(emailType !== undefined ? { type: emailType } : {}),
        },
      })

      return emailTemplate
    },
  )
}
