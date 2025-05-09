import { MessageSchema } from "isomorphic-blocs/src/generated/prisma"

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
        operationId: "Get messages",
        description: "Returns the current workspace's messages",
        response: {
          200: {
            type: "array",
            items: MessageSchema,
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const messages = await fastify.prisma.message.findMany({
        where: {
          workspaceId,
        },
      })

      return messages.map((message) => ({
        ...message,
        content: message.type.includes("EMAIL")
          ? fastify.email.processEmailContent(message.content, {
              sanitize: true,
              removeQuotedReplies: true,
            })
          : message.content,
      }))
    },
  )
}
