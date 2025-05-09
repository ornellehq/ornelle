import { ApplicationStatusSchema } from "isomorphic-blocs/src/generated/prisma"
import { ApplicationStatusCategory } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["ApplicationStatus"],
        operationId: "Update application status",
        description: "Update an application status by id",
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
          },
        },
        response: {
          200: ApplicationStatusSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params
      const { name, category, color } = request.body

      const updatedStatus = await fastify.prisma.applicationStatus.update({
        where: {
          id,
          workspaceId,
        },
        data: {
          ...(name && { name }),
          ...(category && { category }),
          ...(color && { color }),
        },
      })

      return updatedStatus
    },
  )
}
