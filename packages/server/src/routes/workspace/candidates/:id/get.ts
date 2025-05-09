import { CandidateSchema } from "isomorphic-blocs/src/generated/prisma"
import { EntityType } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Candidate"],
        operationId: "Get candidate",
        description: "Returns a candidate by ID",
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
          200: CandidateSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params
      const candidate = await fastify.prisma.candidate.findUnique({
        where: {
          workspaceId,
          id,
        },
      })

      if (!candidate) return fastify.httpErrors.notFound()

      return (
        await fastify.services.entity.mergeAttributes(
          [candidate],
          EntityType.Candidate,
        )
      )[0]
    },
  )
}
