import {
  RoleSchema,
  rteValueSchema,
} from "isomorphic-blocs/src/generated/prisma"
import { EntityType, type Prisma } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Role"],
        operationId: "Update a role",
        description: "Updates a role by ID",
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
            title: {
              type: "string",
            },
            description: rteValueSchema,
          },
        },
        response: {
          200: RoleSchema,
          404: { $ref: "HttpError" },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params
      const { title, description } = request.body

      const data: Prisma.RoleUpdateInput = {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
      }
      const role = await fastify.prisma.role.update({
        where: {
          id,
          workspace: {
            id: workspaceId,
          },
        },
        data,
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
