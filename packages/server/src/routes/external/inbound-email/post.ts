import { type Message, MessageType } from "isomorphic-blocs/src/prisma"
import { messageIdentifierLocalPart } from "~/shared/regexes"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [],
      schema: {
        tags: ["External"],
        operationId: "Create message for inbound email",
        description:
          "Creates a message for an inbound email - emails sent to a profile's alias email address",
        body: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "object",
              additionalProperties: true,
            },
          },
          additionalProperties: true,
        },
        response: {
          // 200: UserSchema,
        },
      },
    },
    async (request) => {
      try {
        // Parse the inbound email using the email service
        const email = await fastify.email.parseInboundEmail(request.body.data)

        if (!email) {
          throw new Error("Failed to parse inbound email")
        }

        // Extract workspace and application info from the recipient email
        const recipient = email.to[0] // Primary recipient
        if (!recipient) {
          return fastify.httpErrors.badRequest()
        }

        // Find the email address
        const emailAddress = await fastify.prisma.emailAddress.findFirstOrThrow(
          {
            where: { email: recipient.email },
            select: {
              workspaceId: true,
              profile: {
                select: {
                  id: true,
                  displayName: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        )

        // Find the sender's profile or candidate
        const senderCandidate = await fastify.prisma.candidate.findFirst({
          where: {
            email: {
              equals: email.from.email,
            },
          },
        })

        const cleanMessageId = email.inReplyTo?.match(
          messageIdentifierLocalPart,
        )?.[1]
        let existingMessage: Message | null = null

        if (cleanMessageId || email.inReplyTo) {
          // Find existing thread by subject and application
          existingMessage = await fastify.prisma.message.findFirst({
            where: {
              type: {
                in: [MessageType.EMAIL_OUTBOUND, MessageType.EMAIL_INBOUND],
              },
              OR: [
                ...(cleanMessageId
                  ? [
                      {
                        id: cleanMessageId,
                      },
                    ]
                  : []),
                ...(email.inReplyTo
                  ? [
                      {
                        metadata: {
                          path: ["messageId"],
                          equals: email.inReplyTo,
                        },
                      },
                    ]
                  : []),
              ],
            },
          })
        }

        // Create the message
        const message = await fastify.prisma.message.create({
          data: {
            workspaceId: emailAddress.workspaceId,
            applicationId: existingMessage?.applicationId ?? null,
            parentId: existingMessage?.id ?? null,
            type: MessageType.EMAIL_INBOUND,
            subject: email.subject,
            content: email.body.html || email.body.text || "",
            fromEmail: email.from.email,
            toEmails: email.to.map(({ email }) => email),
            ccEmails: email.cc?.map(({ email }) => email) || [],
            bccEmails: email.bcc?.map(({ email }) => email) || [],
            // attachments: email.attachments || [],
            fromCandidateId: senderCandidate?.id ?? null,
            // threadId: existingThread?.threadId || undefined, // Link to existing thread if found
            metadata: {
              from: email.from,
              to: email.to,
              headers: email.headers || {},
              messageId: email.messageId,
              receivedAt: email.receivedAt.toISOString(),
            },
            status: "DELIVERED",
            // authorId: senderProfile?.id, // Link to profile if sender exists in system
            // authorType: senderProfile
            //   ? "Profile"
            //   : senderCandidate
            //     ? "Candidate"
            //     : undefined,
          },
          include: {
            author: true,
            application: {
              include: {
                candidate: true,
              },
            },
          },
        })

        if (senderCandidate) {
          // Create activity record for the message
          await fastify.prisma.activity.create({
            data: {
              workspaceId: emailAddress.workspaceId,
              entityId: message.applicationId,
              entityType: "Application",
              type: "EmailReceived",
              source: "Candidate",
              sourceId: senderCandidate.id,
              metadata: {
                messageId: message.id,
                messageType: MessageType.EMAIL_INBOUND,
                authorName: senderCandidate.firstName,
              },
            },
          })
        }

        return { success: true, messageId: message.id }
      } catch (error) {
        request.log.error("Failed to process inbound email", error)
        throw error
      }
    },
  )
}

/**
 * Subject, Body, To, Identifier, Reply To, Date, From,
 * In Reply To, References
 * Attachments, CC, BCC
 */
