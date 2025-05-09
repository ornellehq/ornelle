import { SavedSchema } from "isomorphic-blocs/src/generated/prisma"
import type { Prisma } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Saved"],
        operationId: "Get saved items",
        description: "Get saved items for the current workspace and user",
        querystring: {
          type: "object",
          properties: {
            folderId: {
              type: "string",
              description: "Filter saved items by folder ID",
            },
            entityType: {
              type: "string",
              description: "Filter saved items by entity type",
            },
          },
        },
        response: {
          200: {
            type: "array",
            items: SavedSchema,
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId, profileId } = request.workspace
      const { folderId, entityType } = request.query as {
        folderId?: string
        entityType?: string
      }

      // Build query filter
      const filter: Prisma.SavedWhereInput = {
        workspaceId,
        OR: [
          { creatorId: profileId },
          { isSharedWithWorkspace: true },
          { sharedWithProfiles: { some: { id: profileId } } },
        ],
      }

      // Add optional filters
      if (folderId) {
        filter.folderId = folderId
      }

      if (entityType) {
        filter.entityType = entityType
      }

      // Get saved items that match the criteria
      const savedItems = await fastify.prisma.saved.findMany({
        where: filter,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          folder: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      return savedItems
    },
  )
}
