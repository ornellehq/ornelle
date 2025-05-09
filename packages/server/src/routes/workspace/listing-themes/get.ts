import { ListingThemeSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Listing Theme"],
        operationId: "Get listing themes",
        description: "Returns the current workspace's job board themes",
        response: {
          200: {
            type: "array",
            items: ListingThemeSchema,
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace

      const listingThemes = await fastify.prisma.listingTheme.findMany({
        where: {
          workspace: {
            id: workspaceId,
          },
        },
      })

      return listingThemes
    },
  )
}
