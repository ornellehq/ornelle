import {
  ApplicationSchema,
  ApplicationStatusSchema,
  CandidateSchema,
  FormSchema,
  ReviewSchema,
} from "isomorphic-blocs/src/generated/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Review"],
        operationId: "Get review",
        description: "Get a review within the current workspace",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },
        querystring: {
          type: "object",
          properties: {
            purpose: {
              type: "string",
              enum: ["review"],
            },
          },
        },
        response: {
          200: {
            ...ReviewSchema,
            properties: {
              ...ReviewSchema.properties,
              application: {
                ...ApplicationSchema,
                required: [
                  ...ApplicationSchema.required,
                  "status",
                  "candidate",
                ],
                properties: {
                  ...ApplicationSchema.properties,
                  candidate: CandidateSchema,
                  status: ApplicationStatusSchema,
                },
              },
              form: FormSchema,
              name: {
                type: "string",
              },
            },
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { purpose } = request.query

      const review = await fastify.prisma.review.findUnique({
        where: {
          workspaceId,
          id: request.params.id,
        },
        include: {
          application: {
            include: {
              candidate: true,
              status: true,
            },
          },
          form: true,
        },
      })

      if (!review) {
        return fastify.httpErrors.notFound()
      }

      return review
    },
  )
}
