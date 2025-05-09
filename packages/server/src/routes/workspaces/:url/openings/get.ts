import { OpeningSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        // fastify.authenticate.forUser,
        // fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Listings"],
        operationId: "Get openings",
        description: "Returns the current workspace's openings",
        params: {
          type: "object",
          required: ["url"],
          properties: {
            url: {
              type: "string",
            },
          },
        },
        response: {
          200: {
            type: "array",
            items: OpeningSchema,
          },
        },
      },
    },
    async (request) => {
      const { url } = request.params
      const openings = await fastify.prisma.opening.findMany({
        where: {
          workspace: {
            url,
          },
        },
      })

      return openings
    },
  )
}
