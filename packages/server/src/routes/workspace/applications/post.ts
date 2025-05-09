import {
  ApplicationSchema,
  CandidateSchema,
} from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Application"],
        operationId: "Create application",
        description: "Creates an application in the current workspace",
        body: {
          type: "object",
          required: ["candidate", "opening"],
          properties: {
            candidate: {
              type: "string",
            },
            opening: {
              type: "string",
            },
          },
        },
        response: {
          200: {
            ...ApplicationSchema,
            required: [...ApplicationSchema.required, "candidate"],
            properties: {
              ...ApplicationSchema.properties,
              candidate: CandidateSchema,
            },
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { candidate, opening } = request.body
      return fastify.prisma.$transaction(async (prisma) => {
        const lastApplication = await prisma.application.findFirst({
          where: {
            workspaceId,
          },
          orderBy: {
            numberInWorkspace: "desc",
          },
        })

        const application = await prisma.application.create({
          data: {
            workspaceId,
            candidateId: candidate,
            openingId: opening,
            resumeLink: "",
            resumeText: "",
            responses: {},
            numberInWorkspace: lastApplication
              ? lastApplication.numberInWorkspace + 1
              : 100001,
          },
          include: {
            candidate: true,
          },
        })

        return application
      })
    },
  )
}
