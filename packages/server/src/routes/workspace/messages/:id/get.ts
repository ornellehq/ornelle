import { MessageSchema } from "isomorphic-blocs/src/generated/prisma"

// MessageSchema.properties.parent = MessageSchema
const MessageWithParentSchema = {
  ...MessageSchema,
  properties: {
    ...MessageSchema.properties,
    parent: MessageSchema,
  },
  additionalProperties: true,
}

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Message"],
        operationId: "Get message",
        description: "Returns a message with the current workspace",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        querystring: {
          type: "object",
          properties: {
            includeParents: {
              type: "boolean",
              description:
                "Whether to include parent messages up to 5 levels deep",
            },
          },
        },
        response: {
          200: MessageWithParentSchema,
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.workspace
      const messageId = request.params.id
      const includeParents = request.query.includeParents === true

      // Fetch the main message
      const message = await fastify.prisma.message.findUnique({
        where: {
          id: messageId,
          workspaceId,
        },
      })

      if (!message) {
        return reply.callNotFound()
      }

      // If parents are not requested, return just the message
      if (!includeParents) {
        return message
      }

      let parentId = message.parentId
      let parent = message
      let depth = 5

      while (parentId && parent && depth > 0) {
        const _newParent = await fastify.prisma.message.findUnique({
          where: {
            id: parentId,
            workspaceId,
          },
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        })

        if (!_newParent) {
          break
        }

        const newParent = {
          ..._newParent,
          content: _newParent.type.includes("EMAIL")
            ? fastify.email.processEmailContent(_newParent.content, {
                sanitize: true,
                removeQuotedReplies: true,
              })
            : _newParent.content,
        }

        parentId = newParent.parentId
        // @ts-ignore
        parent.parent = newParent
        parent = newParent
        depth--
      }

      return {
        ...message,
        content: message.type.includes("EMAIL")
          ? fastify.email.processEmailContent(message.content, {
              sanitize: true,
              removeQuotedReplies: true,
            })
          : message.content,
      }
    },
  )
}
