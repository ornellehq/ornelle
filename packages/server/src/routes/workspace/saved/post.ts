import { SavedSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Saved"],
        operationId: "Create saved item",
        description: "Save an entity for the current user",
        body: {
          type: "object",
          required: ["entityId", "entityType"],
          properties: {
            name: {
              type: "string",
              description: "Optional name for the saved item",
            },
            entityId: {
              type: "string",
              description: "ID of the entity being saved",
            },
            entityType: {
              type: "string",
              description:
                "Type of entity being saved (e.g., 'View', 'Candidate')",
            },
            folderId: {
              type: "string",
              description: "Optional folder to add this saved item to",
            },
            isSharedWithWorkspace: {
              type: "boolean",
              description:
                "Whether this saved item is shared with the entire workspace",
              default: false,
            },
            sharedWithProfileIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Profile IDs to share this saved item with",
              default: [],
            },
          },
        },
        response: {
          201: SavedSchema,
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId, profileId } = request.workspace
      const {
        name,
        entityId,
        entityType,
        folderId,
        isSharedWithWorkspace = false,
        sharedWithProfileIds = [],
      } = request.body

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

      // Check if entity exists before saving it
      try {
        // Use appropriate query based on entity type
        let entityExists = false

        switch (entityType.toLowerCase()) {
          case "view":
            entityExists = !!(await fastify.prisma.view.findFirst({
              where: { id: entityId, workspaceId },
            }))
            break
          case "candidate":
            entityExists = !!(await fastify.prisma.candidate.findFirst({
              where: { id: entityId, workspaceId },
            }))
            break
          case "application":
            entityExists = !!(await fastify.prisma.application.findFirst({
              where: { id: entityId, workspaceId },
            }))
            break
          case "role":
            entityExists = !!(await fastify.prisma.role.findFirst({
              where: { id: entityId, workspaceId },
            }))
            break
          case "opening":
            entityExists = !!(await fastify.prisma.opening.findFirst({
              where: { id: entityId, workspaceId },
            }))
            break
          default:
            return reply.badRequest(`Unsupported entity type: ${entityType}`)
        }

        if (!entityExists) {
          return reply.notFound(`${entityType} with ID ${entityId} not found`)
        }
      } catch (error) {
        fastify.log.error(error)
        return reply.badRequest("Invalid entity type or entity ID")
      }

      // Check if this entity is already saved by this user
      const existingSaved = await fastify.prisma.saved.findFirst({
        where: {
          creatorId: profileId,
          entityId,
          entityType,
          workspaceId,
        },
      })

      if (existingSaved) {
        return reply.conflict("This entity is already saved")
      }

      // Create the saved item
      const savedItem = await fastify.prisma.saved.create({
        data: {
          ...(name && { name }),
          entityId,
          entityType,
          isSharedWithWorkspace,
          workspace: {
            connect: {
              id: workspaceId,
            },
          },
          creator: {
            connect: {
              id: profileId,
            },
          },
          ...(folderId && {
            folder: {
              connect: {
                id: folderId,
              },
            },
          }),
          ...(sharedWithProfileIds.length > 0 && {
            sharedWithProfiles: {
              connect: sharedWithProfileIds.map((id: string) => ({ id })),
            },
          }),
        },
      })

      return reply.status(201).send(savedItem)
    },
  )
}
