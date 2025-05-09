import { ApplicationStatusSchema } from "isomorphic-blocs/src/generated/prisma"
import { ApplicationStatusCategory } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["ApplicationStatus"],
        operationId: "Create application status",
        description: "Create a new application status for a workspace",
        body: {
          type: "object",
          required: ["name", "category"],
          properties: {
            name: {
              type: "string",
              description: "The name of the application status",
            },
            category: {
              type: "string",
              enum: Object.keys(
                ApplicationStatusCategory,
              ) as ApplicationStatusCategory[],
              description: "The category of the application status",
            },
            color: {
              type: "string",
              description: "The color of the application status (hex code)",
            },
            isOutOfTheBox: {
              type: "boolean",
              description: "Whether this status is an out-of-the-box status",
              default: false,
            },
          },
        },
        response: {
          201: ApplicationStatusSchema,
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.workspace
      const { name, category, color, isOutOfTheBox } = request.body

      try {
        // Check if status with same name already exists
        const existingStatus = await fastify.prisma.applicationStatus.findFirst(
          {
            where: {
              workspaceId,
              name,
            },
          },
        )

        if (existingStatus) {
          return reply.conflict(
            "Application status with this name already exists",
          )
        }

        const applicationStatus = await fastify.prisma.applicationStatus.create(
          {
            data: {
              name,
              category,
              isOutOfTheBox: isOutOfTheBox || false,
              workspaceId,
              ...(color && { color }),
            },
          },
        )

        return reply.code(201).send(applicationStatus)
      } catch (error) {
        request.log.error(error)
        return reply.internalServerError("Failed to create application status")
      }
    },
  )
}
