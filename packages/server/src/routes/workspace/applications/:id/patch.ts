import {
  ApplicationSchema,
  CandidateSchema,
} from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Application"],
        operationId: "Update application",
        description: "Updates an application by id",
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
            candidate: {
              type: "string",
            },
            statusId: {
              type: "string",
              description: "ID of the application status",
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
      const { id: workspaceId, profileId } = request.workspace
      const { id } = request.params
      const { candidate, statusId } = request.body

      // If updating status, get the current application to record previous status
      let previousStatus = null
      if (statusId) {
        const currentApp = await fastify.prisma.application.findUnique({
          where: {
            id,
            workspaceId,
          },
          include: {
            status: true,
          },
        })
        if (currentApp) {
          previousStatus = currentApp.status
        }
      }

      const application = await fastify.prisma.application.update({
        where: {
          id,
          workspaceId,
        },
        data: {
          ...(candidate ? { candidateId: candidate } : {}),
          ...(statusId ? { statusId: statusId } : {}),
        },
        include: {
          candidate: true,
          status: true,
        },
      })

      if (!application) return reply.notFound()

      // Create activity record for status change
      if (statusId) {
        const profile = await fastify.prisma.profile.findUnique({
          where: {
            workspaceId,
            id: profileId,
          },
        })

        if (profile) {
          await fastify.prisma.activity.create({
            data: {
              workspaceId,
              sourceId: profile.id,
              entityId: id,
              entityType: "Application",
              source: "Profile",
              type: "ApplicationStatusUpdate",
              previousValue: previousStatus
                ? {
                    value: previousStatus.name,
                  }
                : null,
              newValue: application.status
                ? {
                    value: application.status.name,
                  }
                : null,
              metadata: {
                attributeName: "Status",
                sourceName: `${profile.firstName} ${profile.lastName}`.trim(),
              },
            },
          })
        }
      }

      return application
    },
  )
}
