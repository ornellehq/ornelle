import { ListingThemeSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.put(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Listing Theme"],
        operationId: "Upsert listing theme",
        description:
          "Creates or updates a listing theme in the current workspace",
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
          required: ["name"],
          properties: {
            name: {
              type: "string",
            },
            openingConfig: {},
            openingsConfig: {},
          },
        },
        response: {
          200: ListingThemeSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params
      const { name, openingConfig, openingsConfig } = request.body

      const listingThemes = await fastify.prisma.listingTheme.upsert({
        where: {
          workspaceId_key: {
            workspaceId,
            key: id,
          },
        },
        create: {
          key: id,
          name,
          active: true,
          workspaceId,
          openingConfig,
          openingsConfig,
        },
        update: {
          name,
          ...(openingConfig ? { openingConfig } : {}),
          ...(openingsConfig ? { openingsConfig } : {}),
        },
      })

      return listingThemes
    },
  )
}
