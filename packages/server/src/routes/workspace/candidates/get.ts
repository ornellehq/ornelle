import {
  CandidateSchema,
  EntityViewQuerySchema,
} from "isomorphic-blocs/src/generated/prisma"
import { EntityType } from "isomorphic-blocs/src/prisma"
import type {
  Filter,
  SelectedFilter,
} from "isomorphic-blocs/src/types/conditions"

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
        operationId: "Get candidates",
        description: "Returns the current workspace's candidates",
        querystring: EntityViewQuerySchema,
        response: {
          200: {
            type: "array",
            items: {
              ...CandidateSchema,
              required: [...CandidateSchema.required, "applicationsCount"],
              properties: {
                ...CandidateSchema.properties,
                applicationsCount: {
                  type: "number",
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

      const query = fastify.kysely.selectFrom("Candidate as e").selectAll("e")

      let qb = fastify.services.entity.findEntities({
        entityType: EntityType.Candidate,
        options: { filters: filters ?? [], sorts: sorts ?? [] },
        qb: query,
      }) as typeof query

      qb = qb.where("e.workspaceId", "=", workspaceId).select((eb) => {
        return (
          eb
            .selectFrom("Application")
            .select((eb) => eb.fn.count("Application.id").as("count"))
            .whereRef("e.id", "=", "Application.candidateId")
            // .where("Application.deletedAt", "is", null)
            .as("applicationsCount")
        )
      })

      const candidates = await qb.execute()

      return fastify.services.entity.mergeAttributes(
        candidates,
        EntityType.Candidate,
      )
      // const candidateFields = Object.keys(fastify.prisma.candidate.fields)

      // const query2 = filters?.some(
      //   (filter) => !candidateFields.includes(filter.id),
      // )
      //   ? (() => {
      //       const customAttributeFilters = filters.filter(
      //         (filter) => !candidateFields.includes(filter.id),
      //       )

      //       customAttributeFilters.map((filter) => {
      //         query = query.where((qb) => {
      //           const avQuery = db.selectFrom("AttributeValue as av")
      //           return filter.operator === "isNull"
      //             ? qb.not((qb) =>
      //                 qb.exists(
      //                   avQuery
      //                     .where("entityId", "=", sql`e.id`)
      //                     .where("attributeId", "=", filter.id),
      //                 ),
      //               )
      //             : qb.exists(
      //                 avQuery
      //                   .where("entityId", "=", sql`e.id`)
      //                   .where("attributeId", "=", filter.id)
      //                   .where((eb) => {
      //                     const isText = (
      //                       [
      //                         "Email",
      //                         "Text",
      //                         "URL",
      //                         "Phone",
      //                       ] as Filter["type"][]
      //                     ).includes(filter.type)
      //                     const valueExp = isText
      //                       ? sql`LOWER(av.data->>'value')`
      //                       : sql`av.data->>'value'`

      //                     switch (filter.operator) {
      //                       // case "eq":
      //                       //   return eb(valueExp, "=", filter.value)
      //                       // case "notEq":
      //                       //   return eb(valueExp, "!=", filter.value)
      //                       case "contains":
      //                         return eb(valueExp, "ilike", `%${filter.value}%`)
      //                       case "notContains":
      //                         return eb.or([
      //                           eb(valueExp, "not ilike", `%${filter.value}%`),
      //                           eb(valueExp, "is", null),
      //                         ])
      //                       // case "gt":
      //                       //   return eb(valueExp, ">", filter.value)
      //                       // case "gte":
      //                       //   return eb(valueExp, ">=", filter.value)
      //                       // case "lt":
      //                       //   return eb(valueExp, "<", filter.value)
      //                       // case "lte":
      //                       //   return eb(valueExp, "<=", filter.value)
      //                       case "isNull":
      //                         return eb.or([
      //                           eb(valueExp, "is", null),
      //                           eb(valueExp, "=", ""),
      //                         ])
      //                       case "isNotNull":
      //                         return eb(valueExp, "is not", null)
      //                       default:
      //                         return eb(
      //                           valueExp,
      //                           operatorToSqlMap[filter.operator],
      //                           isText
      //                             ? (filter.value as string).toLowerCase()
      //                             : filter.value,
      //                         )
      //                       // throw new Error(
      //                       //   `Unsupported operator: ${filter.operator}`,
      //                       // )
      //                     }
      //                   }),
      //               )
      //         })
      //       })

      //       return query
      //     })()
      //   : query

      // let query3 = filters?.some((filter) =>
      //   candidateFields.includes(filter.id),
      // )
      //   ? (() => {
      //       return query2.where((eb) => {
      //         return eb.and(
      //           filters
      //             ?.filter((filter) => candidateFields.includes(filter.id))
      //             .map((filter) => {
      //               // return eb(`${filter.id}`, , filter.value)
      //               const isText = (
      //                 ["Email", "Text", "URL", "Phone"] as Filter["type"][]
      //               ).includes(filter.type)
      //               const column = filter.id as ReferenceExpression<
      //                 DB & { e: Candidate },
      //                 "e"
      //               >
      //               return (() => {
      //                 switch (filter.operator) {
      //                   // case "eq":
      //                   //   return eb(valueExp, "=", filter.value)
      //                   // case "notEq":
      //                   //   return eb(valueExp, "!=", filter.value)
      //                   case "contains":
      //                     return eb(column, "ilike", `%${filter.value}%`)
      //                   case "notContains":
      //                     return eb.or([
      //                       eb(column, "not ilike", `%${filter.value}%`),
      //                       eb(column, "is", null),
      //                     ])
      //                   // case "gt":
      //                   //   return eb(column, ">", filter.value)
      //                   // case "gte":
      //                   //   return eb(column, ">=", filter.value)
      //                   // case "lt":
      //                   //   return eb(column, "<", filter.value)
      //                   // case "lte":
      //                   //   return eb(column, "<=", filter.value)
      //                   case "isNull":
      //                     return eb(column, "is", null)
      //                   case "isNotNull":
      //                     return eb(column, "is not", null)
      //                   default:
      //                     return isText
      //                       ? eb(
      //                           sql`LOWER(${column})`,
      //                           operatorToSqlMap[filter.operator],
      //                           (filter.value as string).toLowerCase(),
      //                         )
      //                       : eb(
      //                           column,
      //                           operatorToSqlMap[filter.operator],
      //                           filter.value,
      //                         )
      //                   // throw new Error(
      //                   //   `Unsupported operator: ${filter.operator}`,
      //                   // )
      //                 }
      //               })()
      //             }) ?? [],
      //         )
      //       })
      //     })()
      //   : query2

      // if (sorts)
      //   sorts?.map((sort) => {
      //     const attributeId = sort.id
      //     const direction = sort.order

      //     if (candidateFields.some((name) => name === attributeId)) {
      //       query3 = query3.orderBy(attributeId, direction)
      //     } else {
      //       // Custom atttribute
      //       query3 = query3
      //         .leftJoin("AttributeValue as av", (join) =>
      //           join
      //             .onRef("av.entityId", "=", "e.id")
      //             .on("attributeId", "=", sql`${attributeId}`),
      //         )
      //         .select(sql`av.data ->> 'value' as sort_column`)
      //         // .where("AttributeValue.attributeId", "=", attributeId)
      //         .orderBy(sql`sort_column`, direction)
      //     }
      //   })
      // else query3.orderBy("createdAt desc")

      // // const compiled = query3.compile()
      // candidates = await query3
      //   .where("e.workspaceId", "=", workspaceId)

      //   .distinct()
      //   .execute()

      //   const hasNextPage = !!(input?.take && dbRes.length > input.take)
      //   const candidates = hasNextPage ? dbRes.slice(0, -1) : dbRes
      //   const endCursor = dbRes[dbRes.length - 1]?.id

      //   reply.header("X-Has-Next-Page", hasNextPage.toString())
      //   if (endCursor) {
      //     reply.header("X-End-Cursor", endCursor)
      //   }
      //   reply.header("X-Page-Size", input?.take)
    },
  )
}
