import { SavedFolderSchema } from "isomorphic-blocs/src/generated/prisma"
import type { Prisma } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["SavedFolder"],
        operationId: "Update saved folder",
        description: "Update a saved folder by id",
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
              description: "The name of the saved folder",
            },
            isSharedWithWorkspace: {
              type: "boolean",
              description:
                "Whether this folder is shared with the entire workspace",
            },
            sharedWithProfileIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Profile IDs to share this folder with",
            },
            parentId: {
              type: "string",
              description:
                "Parent folder ID (use null to make it a root folder)",
              nullable: true,
            },
          },
        },
        response: {
          200: SavedFolderSchema,
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId, profileId } = request.workspace
      const { id } = request.params
      const { name, isSharedWithWorkspace, sharedWithProfileIds, parentId } =
        request.body

      // Check if folder exists and is owned by the user
      const existingFolder = await fastify.prisma.savedFolder.findFirst({
        where: {
          id,
          workspaceId,
          creatorId: profileId, // Only the creator can update
        },
      })

      if (!existingFolder) {
        return reply.notFound(
          "Saved folder not found or you don't have permission to update it",
        )
      }

      // Check if parent folder exists and is accessible if provided
      if (parentId !== undefined && parentId !== null) {
        // Make sure we're not creating a circular dependency
        if (parentId === id) {
          return reply.badRequest("A folder cannot be its own parent")
        }

        // Check if the parent folder exists and is accessible
        const parentFolder = await fastify.prisma.savedFolder.findUnique({
          where: {
            id: parentId,
            workspaceId,
            OR: [
              { creatorId: profileId },
              { isSharedWithWorkspace: true },
              { sharedWithProfiles: { some: { id: profileId } } },
            ],
          },
        })

        if (!parentFolder) {
          return reply.badRequest(
            "Parent folder not found or you don't have access to it",
          )
        }

        // Check for circular references in the folder hierarchy
        const isCircular = await checkForCircularReference(
          fastify.prisma,
          parentId,
          id,
        )

        if (isCircular) {
          return reply.badRequest(
            "Cannot set parent: would create a circular folder structure",
          )
        }
      }

      // Prepare data for update
      const updateData: Prisma.SavedFolderUpdateInput = {}
      if (name !== undefined) updateData.name = name
      if (isSharedWithWorkspace !== undefined)
        updateData.isSharedWithWorkspace = isSharedWithWorkspace

      // Handle parent folder update
      if (parentId !== undefined) {
        if (parentId === null) {
          updateData.parent = { disconnect: true }
        } else {
          updateData.parent = { connect: { id: parentId } }
        }
      }

      // Perform update with transaction if shared profiles need updating
      if (sharedWithProfileIds !== undefined) {
        // First disconnect all existing shared profiles, then connect the new ones
        const updatedFolder = await fastify.prisma.$transaction(async (tx) => {
          // Disconnect all current shared profiles
          const updatedFolder = await tx.savedFolder.update({
            where: { id },
            data: {
              sharedWithProfiles: {
                set: [], // Clear existing connections
              },
            },
          })

          if (!sharedWithProfileIds.length) return updatedFolder

          // Update with new data including reconnecting shared profiles
          return tx.savedFolder.update({
            where: { id },
            data: {
              ...updateData,
              sharedWithProfiles: {
                connect: sharedWithProfileIds.map((id: string) => ({ id })),
              },
            },
          })
        })

        return updatedFolder
      }

      // Simple update without changing shared profiles
      const updatedFolder = await fastify.prisma.savedFolder.update({
        where: { id },
        data: updateData,
      })

      return updatedFolder
    },
  )
}

// Helper function to check for circular references in folder hierarchy
async function checkForCircularReference(
  prisma: FastifyWithSchemaProvider["prisma"],
  parentId: string,
  childId: string,
): Promise<boolean> {
  // If parent would be set to child, that's circular
  if (parentId === childId) return true

  // Check ancestors of the potential parent folder
  let currentFolder = await prisma.savedFolder.findUnique({
    where: { id: parentId },
    select: { parentId: true },
  })

  // Traverse up the tree to check if childId appears
  while (currentFolder?.parentId) {
    if (currentFolder.parentId === childId) {
      return true
    }

    currentFolder = await prisma.savedFolder.findUnique({
      where: { id: currentFolder.parentId },
      select: { parentId: true },
    })
  }

  return false
}
