import {
  ApplicationSchema,
  CandidateSchema,
  EntityViewQuerySchema,
  OpeningSchema,
} from "isomorphic-blocs/src/generated/prisma"
import type { Application, DB } from "isomorphic-blocs/src/kysely"
import { EntityType } from "isomorphic-blocs/src/prisma"
import type {
  Filter,
  SelectedFilter,
} from "isomorphic-blocs/src/types/conditions"
import type { ExpressionWrapper, StringReference } from "kysely"
import { jsonBuildObject } from "kysely/helpers/postgres"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Application"],
        operationId: "Get applications",
        description: "Returns the current workspace's applications",
        querystring: EntityViewQuerySchema,
        response: {
          200: {
            type: "array",
            items: {
              ...ApplicationSchema,
              required: [...ApplicationSchema.required, "candidate", "opening"],
              properties: {
                ...ApplicationSchema.properties,
                candidate: CandidateSchema,
                opening: {
                  type: "object",
                  properties: {
                    id: OpeningSchema.properties.id,
                    title: OpeningSchema.properties.title,
                  },
                  required: ["id", "title"],
                },
              },
            },
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { sorts } = request.query
      const filters = request.query.filters as
        | (Filter & SelectedFilter)[]
        | undefined

      const query = fastify.kysely.selectFrom("Application as e").selectAll("e")
      const candidateFields = fastify.prisma.candidate.fields

      let qb = fastify.services.entity.findEntities({
        entityType: EntityType.Application,
        options: { filters: filters ?? [], sorts: sorts ?? [] },
        qb: query,
      }) as typeof query

      qb = qb
        .where("e.workspaceId", "=", workspaceId)
        .innerJoin("Candidate", (join) => {
          return join.onRef("e.candidateId", "=", "Candidate.id")
        })
        .leftJoin("Opening", (join) => {
          return join.onRef("e.openingId", "=", "Opening.id")
        })
        .select((eb) => {
          const buildObject = Object.keys(candidateFields).reduce(
            (acc, key) => {
              acc[key] = eb.ref(
                `Candidate.${key}` as StringReference<
                  DB & { e: Application },
                  "Candidate" | "e"
                >,
              )
              return acc
            },
            {} as Record<
              string,
              ExpressionWrapper<
                DB & { e: Application },
                "Candidate" | "e",
                unknown
              >
            >,
          )

          return jsonBuildObject(buildObject).as("candidate")
        })
        .select((eb) => {
          return jsonBuildObject({
            id: eb.ref("Opening.id"),
            title: eb.ref("Opening.title"),
          }).as("opening")
        })

      const applications = await qb
        // .distinct()

        .execute()

      return fastify.services.entity.mergeAttributes(
        applications,
        EntityType.Application,
      )

      // const input = request.query.input as
      //   | Prisma.ApplicationFindManyArgs
      //   | undefined
      // const where: Prisma.ApplicationWhereInput = {
      //   ...input?.where,
      //   workspace: {
      //     id: workspaceId,
      //   },
      // }

      // const dbRes = await fastify.prisma.application.findMany({
      //   ...input,
      //   ...(input?.take ? { take: Number(input.take) + 1 } : {}),
      //   where,
      //   include: {
      //     ...input?.include,
      //     candidate: true,
      //   },
      // })

      // const hasNextPage = !!(input?.take && dbRes.length > input.take)
      // const applications = hasNextPage ? dbRes.slice(0, -1) : dbRes
      // const endCursor = dbRes[dbRes.length - 1]?.id

      // reply.header("X-Has-Next-Page", hasNextPage.toString())
      // if (endCursor) {
      //   reply.header("X-End-Cursor", endCursor)
      // }
      // reply.header("X-Page-Size", input?.take)
    },
  )
}
