import { ReviewSchema } from "isomorphic-blocs/src/generated/prisma"
import { ReviewStatus } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Review"],
        operationId: "Update review",
        description: "Updates a review's responses",
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
          required: [],
          properties: {
            responses: {
              type: "array",
              items: {},
            },
            status: {
              type: "string",
              enum: Object.values(ReviewStatus),
            },
          },
        },
        response: {
          200: ReviewSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId, profileId } = request.workspace
      const { id: reviewId } = request.params
      const { responses, status } = request.body

      // Get the review and verify ownership
      const review = await fastify.prisma.review.findUnique({
        where: {
          id: reviewId,
          workspaceId,
        },
        include: {
          author: true,
        },
      })

      if (!review) {
        return fastify.httpErrors.notFound("Review not found")
      }

      if (review.authorId !== profileId) {
        return fastify.httpErrors.forbidden(
          "Not authorized to update this review",
        )
      }

      // Update review and create activity in a transaction
      return await fastify.prisma.$transaction(async (prisma) => {
        const updatedReview = await prisma.review.update({
          where: {
            id: reviewId,
          },
          data: {
            ...(responses ? { responses } : {}),
            ...(status ? { status } : {}),
          },
        })

        // Create an activity record for the review update
        await prisma.activity.create({
          data: {
            workspaceId,
            type: "ReviewUpdated",
            sourceId: profileId,
            source: "Profile",
            entityType: "Application",
            entityId: review.applicationId,
            previousValue: {
              ...(responses ? { responses: review.responses } : {}),
              ...(status ? { status: review.status } : {}),
            },
            newValue: {
              ...(responses ? { responses: updatedReview.responses } : {}),
              ...(status ? { status: updatedReview.status } : {}),
            },
            metadata: {
              reviewId: updatedReview.id,
              authorName:
                `${author.displayName || author.firstName || ""}`.trim(),
            },
          },
        })

        return updatedReview
      })
    },
  )
}
