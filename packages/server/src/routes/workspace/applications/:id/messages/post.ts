import { init } from "@paralleldrive/cuid2"
import { MessageSchema } from "isomorphic-blocs/src/generated/prisma"
import { type EmailAddress, MessageType } from "isomorphic-blocs/src/prisma"
import { replaceEmailVariables } from "~/blocs/email/utils"
import env from "~/env"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["Application"],
        operationId: "Create message",
        description: "Sends a message internally or to a candidate",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        body: {
          type: "object",
          required: ["type", "content"],
          properties: {
            type: {
              type: "string",
              enum: Object.keys(MessageType) as MessageType[],
            },
            subject: {
              type: "string",
              description: "Required for email messages",
            },
            content: { type: "string" },
            ccEmails: {
              type: "array",
              items: { type: "string" },
              default: [],
            },
            bccEmails: {
              type: "array",
              items: { type: "string" },
              default: [],
            },
          },
        },
        response: {
          201: MessageSchema,
        },
      },
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
    },
    async (request) => {
      const { id: applicationId } = request.params
      const { workspace } = request
      const {
        type,
        subject,
        content,
        ccEmails = [],
        bccEmails = [],
      } = request.body

      // Get the application with candidate and profile details
      const [application, profile] = await fastify.prisma.$transaction([
        fastify.prisma.application.findFirst({
          where: {
            id: applicationId,
            workspaceId: workspace.id,
          },
          include: {
            candidate: true,
            opening: {
              select: {
                roleId: true,
              },
            },
          },
        }),
        fastify.prisma.profile.findUnique({
          where: {
            workspaceId: workspace.id,
            id: workspace.profileId,
          },
          include: {
            emailAddresses: {
              where: {
                isActive: true,
                deletedAt: null,
              },
            },
          },
        }),
      ])

      if (!application) {
        throw fastify.httpErrors.notFound("Application not found")
      }

      if (!profile) {
        throw fastify.httpErrors.notFound("Profile not found")
      }

      const isOutboundEmail = type === "EMAIL_OUTBOUND"
      let fromEmailAddress: EmailAddress | undefined
      // For email messages, validate email requirements
      if (isOutboundEmail) {
        if (!subject) {
          throw fastify.httpErrors.badRequest(
            "Subject is required for email messages",
          )
        }
        ;[fromEmailAddress] = profile.emailAddresses
        if (!fromEmailAddress) {
          throw fastify.httpErrors.badRequest(
            "Profile does not have an alias email address",
          )
        }
      }

      // Wrap everything in a transaction
      const message = await fastify.prisma.$transaction(async (prisma) => {
        // Create a conversation if one doesn't exist
        // const conversation = await prisma.conversation.upsert({
        //   where: {
        //     applicationId_workspaceId: {
        //       applicationId,
        //       workspaceId: workspace.id,
        //     },
        //   },
        //   create: {
        //     title: subject,
        //     workspaceId: workspace.id,
        //     applicationId,
        //     candidateId: application.candidateId,
        //     creatorId: workspace.profileId,
        //     status: "OPEN",
        //   },
        //   update: {},
        // })
        const messageId = init({ length: 32 })()

        const { body, subject: replacedSubject } =
          isOutboundEmail && subject
            ? await replaceEmailVariables({
                body: content,
                subject,
                candidateId: application.candidateId,
                applicationId: applicationId,
                openingId: application.openingId,
                workspaceId: workspace.id,
                roleId: application.opening.roleId,
              })
            : { body: content, subject: "" }
        // Create the message
        const message = await prisma.message.create({
          data: {
            id: messageId,
            type: type as MessageType,
            status: isOutboundEmail ? "SENDING" : "PUBLISHED",
            content: body,
            subject: isOutboundEmail && subject ? replacedSubject : null,
            fromEmail:
              isOutboundEmail && fromEmailAddress
                ? fromEmailAddress.email
                : null,
            toEmails: isOutboundEmail ? [application.candidate.email] : [],
            ccEmails: isOutboundEmail ? ccEmails : [],
            bccEmails: isOutboundEmail ? bccEmails : [],
            workspaceId: workspace.id,
            applicationId,
            // conversationId: conversation.id,
            authorId: workspace.profileId,
          },
        })

        // Create an activity record
        await prisma.activity.create({
          data: {
            workspaceId: workspace.id,
            sourceId: workspace.profileId,
            entityId: applicationId,
            entityType: "Application",
            source: "Profile",
            type: type === "EMAIL_OUTBOUND" ? "EmailSent" : "MessageSent",
            causedById: message.id,
            metadata: {
              // messageId: message.id,
              messageType: type,
              authorName:
                `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim(),
            },
          },
        })

        // If it's an email message, attempt to send it
        if (type === "EMAIL_OUTBOUND" && fromEmailAddress) {
          if (!subject) {
            throw fastify.httpErrors.badRequest("Subject is required")
          }
          // const messageIdHash = crypto
          //   .createHash("sha256")
          //   .update(message.id)
          //   .digest("hex")
          const messageID = `<${messageId}@${env.EmailServiceConfig.subdomain}.${env.DOMAIN}>`
          const emailResult = await fastify.email.sendEmail({
            from: {
              email: fromEmailAddress.email,
              name: `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim(),
            },
            to: application.candidate.email,
            subject: replacedSubject,
            body,
            cc: ccEmails,
            bcc: bccEmails,
            trackingId: messageID,
          })

          if (!emailResult.success) {
            throw fastify.httpErrors.internalServerError(
              `Failed to send email: ${emailResult.error?.message}`,
            )
          }

          // Update message status to SENT
          await prisma.message.update({
            where: { id: message.id },
            data: {
              status: "SENT",
              metadata: {
                trackingId: emailResult.trackingId,
                messageID,
              },
            },
          })
        }

        return message
      })

      return message
    },
  )
}
