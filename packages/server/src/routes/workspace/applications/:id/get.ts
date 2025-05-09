import {
  ApplicationSchema,
  CandidateSchema,
} from "isomorphic-blocs/src/generated/prisma"
import { EntityType } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Application"],
        operationId: "Get application",
        description:
          "Returns an application in the current workspace with next and previous application IDs",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },
        response: {
          200: {
            ...ApplicationSchema,
            required: [...ApplicationSchema.required, "candidate"],
            properties: {
              ...ApplicationSchema.properties,
              candidate: CandidateSchema,
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      // Get the current application
      const application = await fastify.prisma.application.findUnique({
        where: {
          id,
          workspaceId,
        },
        include: {
          candidate: true,
        },
      })

      if (!application) return reply.notFound()

      // Get the current application's createdAt timestamp
      const { createdAt } = application

      // Find the previous application (created before the current one)
      const [previousApplication, nextApplication] =
        await fastify.prisma.$transaction([
          fastify.prisma.application.findFirst({
            where: {
              workspaceId,
              createdAt: {
                lt: createdAt,
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              id: true,
            },
          }),

          // Find the next application (created after the current one)
          fastify.prisma.application.findFirst({
            where: {
              workspaceId,
              createdAt: {
                gt: createdAt,
              },
            },
            orderBy: {
              createdAt: "asc",
            },
            select: {
              id: true,
            },
          }),
        ])
      if (previousApplication?.id) {
        reply.header("X-Previous", previousApplication.id)
      }

      if (nextApplication?.id) {
        reply.header("X-Next", nextApplication.id)
      }

      // Merge attributes for the application
      const enrichedApplication = (
        await fastify.services.entity.mergeAttributes(
          [application],
          EntityType.Application,
        )
      )[0]

      // Return the application with navigation information
      return enrichedApplication
    },
  )
}
