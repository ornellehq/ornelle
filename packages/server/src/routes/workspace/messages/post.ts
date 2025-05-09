import { init } from "@paralleldrive/cuid2"
import { MessageSchema } from "isomorphic-blocs/src/generated/prisma"
import {
  type Candidate,
  type EmailAddress,
  MessageType,
} from "isomorphic-blocs/src/prisma"
import { replaceEmailVariables } from "~/blocs/email/utils"
import env from "~/env"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["Message"],
        operationId: "Create message",
        description: "Creates a new message in the workspace",
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
            toEmails: {
              type: "array",
              items: { type: "string" },
              default: [],
            },
            conversationId: {
              type: "string",
              description:
                "Optional conversation ID to associate the message with",
            },
            applicationId: {
              type: "string",
              description:
                "Optional application ID to associate the message with",
            },
            parentId: {
              type: "string",
              description: "Parent message ID for replies",
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
    async (request, reply) => {
      const { workspace } = request
      const {
        type,
        subject,
        content,
        ccEmails = [],
        bccEmails = [],
        toEmails = [],
        conversationId,
        applicationId,
        parentId,
      } = request.body

      // Require either conversationId or applicationId
      // if (!conversationId && !applicationId) {
      //   throw fastify.httpErrors.badRequest(
      //     "Either conversationId or applicationId is required",
      //   )
      // }

      const isOutboundEmail = type === "EMAIL_OUTBOUND"

      // Get profile with email addresses
      const profile = await fastify.prisma.profile.findUnique({
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
      })

      if (!profile) {
        throw fastify.httpErrors.notFound("Profile not found")
      }

      let fromEmailAddress: EmailAddress | undefined
      const application = applicationId
        ? await fastify.prisma.application.findFirst({
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
          })
        : null
      let candidate: Candidate | null = null
      let recipientEmail: string[] = []
      let parentMessage = null

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

        // If it's a reply, we need to validate the parent message exists
        if (parentId) {
          parentMessage = await fastify.prisma.message.findUnique({
            where: {
              id: parentId,
              workspaceId: workspace.id,
            },
          })

          if (!parentMessage) {
            throw fastify.httpErrors.notFound("Parent message not found")
          }
          if (parentMessage.fromEmail)
            recipientEmail = [parentMessage.fromEmail]
        }

        // If we have an application ID, fetch the application with candidate
        else if (application) {
          // application = await fastify.prisma.application.findFirst({
          //   where: {
          //     id: applicationId,
          //     workspaceId: workspace.id,
          //   },
          //   include: {
          //     candidate: true,
          //     opening: {
          //       select: {
          //         roleId: true
          //       }
          //     }
          //   },
          // })

          if (!application) {
            throw fastify.httpErrors.notFound("Application not found")
          }

          candidate = application.candidate
          recipientEmail = [candidate.email]
        }

        if (!recipientEmail.length) {
          recipientEmail = toEmails
        }
      }

      // Wrap everything in a transaction
      const message = await fastify.prisma.$transaction(async (prisma) => {
        const messageId = init({ length: 32 })()

        const { body, subject: replacedSubject } =
          isOutboundEmail && subject && application && candidate
            ? await replaceEmailVariables({
                body: content,
                subject,
                candidateId: candidate.id,
                applicationId: application.id,
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
            toEmails: isOutboundEmail ? recipientEmail : [],
            ccEmails: isOutboundEmail ? ccEmails : [],
            bccEmails: isOutboundEmail ? bccEmails : [],
            workspaceId: workspace.id,
            applicationId: applicationId ?? null,
            conversationId: conversationId ?? null,
            authorId: workspace.profileId,
            parentId: parentId ?? null,
          },
        })

        // If it's an email message, attempt to send it
        if (isOutboundEmail && fromEmailAddress) {
          if (!recipientEmail.length) {
            throw fastify.httpErrors.badRequest(
              "Could not determine recipient email address",
            )
          }

          if (!subject) {
            throw fastify.httpErrors.badRequest("Subject is required")
          }

          const messageID = `<${messageId}@${env.EmailServiceConfig.subdomain}.${env.DOMAIN}>`

          // Set up email threading headers if this is a reply
          const emailHeaders: Record<string, string> = {}

          if (parentMessage) {
            // Get the parent message's Message-ID from metadata
            const parentMessageID = (
              parentMessage.metadata as { messageID: string } | undefined
            )?.messageID

            if (parentMessageID) {
              // Add In-Reply-To header pointing to the parent message
              emailHeaders["In-Reply-To"] = parentMessageID

              // Add References header with parent references + parent ID
              const parentReferences =
                (
                  parentMessage.metadata as
                    | { headers: { References?: string } }
                    | undefined
                )?.headers?.References || ""
              emailHeaders.References = parentReferences
                ? `${parentReferences} ${parentMessageID}`
                : parentMessageID
            }
          }

          const emailResult = await fastify.email.sendEmail({
            from: {
              email: fromEmailAddress.email,
              name: `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim(),
            },
            to: recipientEmail,
            subject: replacedSubject,
            body,
            cc: ccEmails,
            bcc: bccEmails,
            trackingId: messageID,
            headers: emailHeaders,
          })

          if (!emailResult.success) {
            throw fastify.httpErrors.internalServerError(
              `Failed to send email: ${emailResult.error?.message}`,
            )
          }

          // Create an activity record if there's an application
          if (applicationId) {
            await prisma.activity.create({
              data: {
                workspaceId: workspace.id,
                sourceId: workspace.profileId,
                entityId: applicationId,
                entityType: "Application",
                source: "Profile",
                type: type === "EMAIL_OUTBOUND" ? "EmailSent" : "MessageSent",
                metadata: {
                  messageId: message.id,
                  messageType: type,
                  authorName:
                    profile.displayName?.trim() ??
                    `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim(),
                },
              },
            })
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

      return reply.status(201).send(message)
    },
  )
}
