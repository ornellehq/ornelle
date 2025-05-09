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
        operationId: "Get listing theme",
        description: "Returns a listing theme by ID",
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
          200: ListingThemeSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      const listingTheme = await fastify.prisma.listingTheme.findUnique({
        where: {
          workspaceId_key: {
            workspaceId,
            key: id,
          },
        },
      })

      return listingTheme
    },
  )
}
