import { CandidateSchema } from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Candidate"],
        operationId: "Create candidate",
        description: "Creates a candidate in the current workspace",
        body: {
          type: "object",
          required: ["firstName", "lastName", "email"],
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
      const candidate = await fastify.prisma.candidate.create({
        data: {
          firstName,
          lastName,
          email,
          workspace: {
            connect: {
              id: workspaceId,
            },
          },
        },
      })

      return candidate
    },
  )
}
