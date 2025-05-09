import { SavedSchema } from "isomorphic-blocs/src/generated/prisma"
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
        tags: ["Saved"],
        operationId: "Update saved item",
        description: "Update a saved item by id",
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
              description: "The name of the saved item",
            },
            folderId: {
              type: "string",
              description:
                "The folder ID to move this saved item to (null to remove from folder)",
            },
            isSharedWithWorkspace: {
              type: "boolean",
              description:
                "Whether this saved item is shared with the entire workspace",
            },
            sharedWithProfileIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Profile IDs to share this saved item with",
            },
          },
        },
        response: {
          200: SavedSchema,
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId, profileId } = request.workspace
      const { id } = request.params
      const { name, folderId, isSharedWithWorkspace, sharedWithProfileIds } =
        request.body

      // Check if saved item exists and is owned by the user
      const existingSavedItem = await fastify.prisma.saved.findFirst({
        where: {
          id,
          workspaceId,
          creatorId: profileId, // Only the creator can update
        },
      })

      if (!existingSavedItem) {
        return reply.notFound(
          "Saved item not found or you don't have permission to update it",
        )
      }

      // Check if folder exists if provided
      if (folderId) {
        const folderExists = await fastify.prisma.savedFolder.findFirst({
          where: {
            id: folderId,
            workspaceId,
            OR: [
              { creatorId: profileId },
              { isSharedWithWorkspace: true },
              { sharedWithProfiles: { some: { id: profileId } } },
            ],
          },
        })

        if (!folderExists) {
          return reply.badRequest(
            "Folder not found or you don't have access to it",
          )
        }
      }

      // Prepare data for update
      const updateData: Prisma.SavedUpdateInput = {}
      if (name !== undefined) updateData.name = name
      if (folderId !== undefined) {
        if (folderId === null) {
          updateData.folder = { disconnect: true }
        } else {
          updateData.folder = { connect: { id: folderId } }
        }
      }
      if (isSharedWithWorkspace !== undefined)
        updateData.isSharedWithWorkspace = isSharedWithWorkspace

      // Perform update with transaction if shared profiles need updating
      if (sharedWithProfileIds !== undefined) {
        // First disconnect all existing shared profiles, then connect the new ones
        const updatedSavedItem = await fastify.prisma.$transaction(
          async (tx) => {
            // Disconnect all current shared profiles
            const updatedSavedItem = await tx.saved.update({
              where: { id },
              data: {
                sharedWithProfiles: {
                  set: [], // Clear existing connections
                },
              },
            })

            if (!sharedWithProfileIds.length) return updatedSavedItem

            // Update with new data including reconnecting shared profiles
            return tx.saved.update({
              where: { id },
              data: {
                ...updateData,
                sharedWithProfiles: {
                  connect: sharedWithProfileIds.map((id: string) => ({ id })),
                },
              },
            })
          },
        )

        return updatedSavedItem
      }

      // Simple update without changing shared profiles
      const updatedSavedItem = await fastify.prisma.saved.update({
        where: { id },
        data: updateData,
      })

      return updatedSavedItem
    },
  )
}
