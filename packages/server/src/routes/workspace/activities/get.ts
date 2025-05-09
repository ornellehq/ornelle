import { ActivitySchema } from "isomorphic-blocs/src/generated/prisma"
import { ActivityType, type Prisma } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Activity"],
        operationId: "Get activities",
        description: "Gets activities in the current workspace",
        querystring: {
          type: "object",
          properties: {
            input: {},
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              ...ActivitySchema,
              properties: {
                ...ActivitySchema.properties,
                sourceEntity: {},
              },
              additionalProperties: true,
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.workspace
      const input = request.query.input as Prisma.ActivityFindManyArgs
      const where: Prisma.ActivityWhereInput = {
        ...input?.where,
        workspace: {
          id: workspaceId,
        },
      }

      const dbRes = await fastify.prisma.activity.findMany({
        ...input,
        ...(input?.take ? { take: Number(input.take) + 1 } : {}),
        where,
        orderBy: {
          createdAt: "desc",
        },
      })
      const sourcesIds = dbRes.reduce(
        (acc, activity) => {
          const metadata = activity.metadata as Record<string, string>
          if (
            (
              [
                ActivityType.MessageSent,
                ActivityType.EmailSent,
                ActivityType.EmailReceived,
              ] as ActivityType[]
            ).includes(activity.type)
          ) {
            const messageId = activity.causedById || metadata?.messageId
            if (messageId) {
              acc.messages.push(messageId)
            }
          } else if (
            (
              [
                ActivityType.ReviewRecommended,
                ActivityType.ReviewRejected,
              ] as ActivityType[]
            ).includes(activity.type)
          ) {
            const reviewId = activity.causedById || metadata?.reviewId
            if (reviewId) {
              acc.reviews.push(reviewId)
            }
          }
          return acc
        },
        { messages: [], reviews: [] } as {
          messages: string[]
          reviews: string[]
        },
      )

      const hasNextPage = !!(input?.take && dbRes.length > input.take)
      const attributes = hasNextPage ? dbRes.slice(0, -1) : dbRes
      const endCursor = dbRes[dbRes.length - 1]?.id

      reply.header("X-Has-Next-Page", hasNextPage.toString())
      if (endCursor) {
        reply.header("X-End-Cursor", endCursor)
      }
      reply.header("X-Page-Size", input?.take)

      const [messages, reviews] = await Promise.all([
        fastify.prisma.message.findMany({
          where: {
            id: {
              in: sourcesIds.messages,
            },
          },
        }),
        fastify.prisma.review.findMany({
          where: {
            id: {
              in: sourcesIds.reviews,
            },
          },
        }),
      ])

      const attributesWithEntities = attributes.map((activity) => {
        const metadata = activity.metadata as Record<string, string>
        if (
          (
            [
              ActivityType.MessageSent,
              ActivityType.EmailSent,
              ActivityType.EmailReceived,
            ] as ActivityType[]
          ).includes(activity.type)
        ) {
          // @ts-ignore
          activity.sourceEntity = messages.find(
            (message) =>
              message.id === (activity.causedById || metadata?.messageId),
          )
        } else if (
          (
            [
              ActivityType.ReviewRecommended,
              ActivityType.ReviewRejected,
            ] as ActivityType[]
          ).includes(activity.type)
        ) {
          // @ts-ignore
          activity.sourceEntity = reviews.find(
            (review) =>
              review.id === (activity.causedById || metadata?.reviewId),
          )
        }
        return activity
      })

      return attributesWithEntities
    },
  )
}
