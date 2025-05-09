import {
  ApplicationSchema,
  CandidateSchema,
  ReviewSchema,
} from "isomorphic-blocs/src/generated/prisma"
import {
  ActionSource,
  type Prisma,
  ReviewStatus,
} from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Review"],
        operationId: "Get reviews",
        description: "Get reviews for the current workspace",
        body: {
          type: "object",
          anyOf: [
            {
              required: [],
              properties: {
                authorId: {
                  type: "string",
                },
                status: {
                  type: "string",
                  enum: Object.values(ReviewStatus),
                },
                source: {
                  type: "string",
                  enum: Object.values(ActionSource),
                },
                sourceId: {
                  type: "string",
                },
              },
            },
            {
              type: "object",
              properties: {
                where: {},
              },
            },
          ],
        },
        response: {
          200: {
            type: "array",
            items: {
              ...ReviewSchema,
              properties: {
                ...ReviewSchema.properties,
                application: {
                  ...ApplicationSchema,
                  properties: {
                    ...ApplicationSchema.properties,
                    candidate: CandidateSchema,
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace

      if ("where" in request.body) {
        const where = request.body.where as Prisma.ReviewWhereInput
        return await fastify.prisma.review.findMany({
          where: {
            workspaceId,
            ...where,
          },
          include: {
            application: {
              include: {
                candidate: true,
              },
            },
          },
        })
      }
      const { authorId, status, source, sourceId } = request.body
      return await fastify.prisma.review.findMany({
        where: {
          workspaceId,
          ...(authorId ? { authorId } : {}),
          ...(status ? { status } : {}),
          ...(source ? { source } : {}),
          ...(sourceId ? { sourceId } : {}),
        },
        include: {
          application: {
            include: {
              candidate: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    },
  )
}
