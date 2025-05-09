import { SavedFolderSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["SavedFolder"],
        operationId: "Create saved folder",
        description: "Create a new saved folder for the current workspace",
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              description: "The name of the saved folder",
            },
            isSharedWithWorkspace: {
              type: "boolean",
              description:
                "Whether this folder is shared with the entire workspace",
              default: false,
            },
            sharedWithProfileIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Profile IDs to share this folder with",
              default: [],
            },
            parentId: {
              type: "string",
              description: "Optional parent folder ID for nested folders",
            },
          },
        },
        response: {
          201: SavedFolderSchema,
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId, profileId } = request.workspace
      const {
        name,
        isSharedWithWorkspace,
        sharedWithProfileIds = [],
        parentId,
      } = request.body

      // Check if parent folder exists if provided
      if (parentId) {
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
      }

      // Create a new saved folder
      const savedFolder = await fastify.prisma.savedFolder.create({
        data: {
          name,
          isSharedWithWorkspace: isSharedWithWorkspace ?? false,
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
          ...(sharedWithProfileIds.length > 0 && {
            sharedWithProfiles: {
              connect: sharedWithProfileIds.map((id: string) => ({ id })),
            },
          }),
          ...(parentId && {
            parent: {
              connect: {
                id: parentId,
              },
            },
          }),
        },
      })

      return reply.status(201).send(savedFolder)
    },
  )
}
