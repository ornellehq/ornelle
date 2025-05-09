import {
  OpeningSchema,
  RoleSchema,
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
        tags: ["Role"],
        operationId: "Get role",
        description: "Return a role by ID",
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
            ...RoleSchema,
            required: [...RoleSchema.required, "openings"],
            properties: {
              ...RoleSchema.properties,
              openings: {
                type: "array",
                items: OpeningSchema,
              },
            },
          },
          404: { $ref: "HttpError" },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      const role = await fastify.prisma.role.findUnique({
        where: {
          id,
          workspaceId,
          deletedAt: null,
        },
        include: {
          openings: true,
        },
      })

      if (!role) {
        throw {
          statusCode: 404,
          message: "Role not found",
        }
      }

      const roleWithAttributes = (
        await fastify.services.entity.mergeAttributes([role], EntityType.Role)
      )[0]

      return roleWithAttributes
    },
  )
}
