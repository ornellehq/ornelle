import { SavedFolderSchema } from "isomorphic-blocs/src/generated/prisma"
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
        tags: ["SavedFolder"],
        operationId: "Get saved folders",
        description: "Get saved folders for the current workspace and user",
        querystring: {
          type: "object",
          properties: {
            parentId: {
              type: ["string", "null"],
              description:
                "Optional parent folder ID to filter by (use 'null' string for root folders)",
            },
          },
        },
        response: {
          200: {
            type: "array",
            items: SavedFolderSchema,
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId, profileId } = request.workspace
      const { parentId } = request.query

      // Build the filter
      const filter: Prisma.SavedFolderWhereInput = {
        workspaceId,
        OR: [
          { creatorId: profileId },
          { isSharedWithWorkspace: true },
          { sharedWithProfiles: { some: { id: profileId } } },
        ],
      }

      // Add parentId filter if provided
      if (parentId !== undefined) {
        // Handle special case for root folders
        if (parentId === "null") {
          filter.parentId = null
        } else {
          filter.parentId = parentId
        }
      }

      // Get folders created by the user or shared with them
      const savedFolders = await fastify.prisma.savedFolder.findMany({
        where: filter,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          children: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              favorites: true,
              children: true,
            },
          },
        },
      })

      return savedFolders
    },
  )
}
