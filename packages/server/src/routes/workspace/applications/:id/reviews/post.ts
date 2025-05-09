import { ReviewSchema } from "isomorphic-blocs/src/generated/prisma"
import { ActionSource, ReviewStatus } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Application"],
        operationId: "Create review",
        description: "Creates a review for an application",
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
          required: ["responses"],
          properties: {
            responses: {
              type: "object",
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
      const { id: applicationId } = request.params
      const { responses } = request.body

      const profile = await fastify.prisma.profile.findUnique({
        where: {
          id: profileId,
        },
      })

      if (!profile) {
        throw fastify.httpErrors.notFound("Profile not found")
      }
      // Create an activity record
      return await fastify.prisma.$transaction(async (prisma) => {
        const review = await prisma.review.create({
          data: {
            workspaceId,
            applicationId,
            authorId: profileId,
            responses,
            status: ReviewStatus.Pending,
            source: ActionSource.Profile,
            sourceId: profileId,
          },
        })

        await prisma.activity.create({
          data: {
            workspaceId: workspaceId,
            sourceId: profileId,
            entityId: applicationId,
            entityType: "Application",
            source: "Profile",
            type: "ReviewCreated",
            causedById: review.id,
            metadata: {
              // reviewId: review.id,
              authorName:
                `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim(),
            },
          },
        })

        return review
      })
    },
  )
}
