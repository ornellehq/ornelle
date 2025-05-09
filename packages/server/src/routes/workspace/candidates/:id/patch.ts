import { CandidateSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Candidate"],
        operationId: "Update a candidate",
        description: "Updates a candidate in the current workspace",
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
            firstName: {
              type: "string",
            },
            lastName: {
              type: "string",
            },
            email: {
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
      const { firstName, lastName, email } = request.body
      const { id } = request.params
      const candidate = await fastify.prisma.candidate.update({
        where: {
          workspace: {
            id: workspaceId,
          },
          id,
        },
        data: {
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          ...(email ? { email } : {}),
        },
      })

      return candidate
    },
  )
}
