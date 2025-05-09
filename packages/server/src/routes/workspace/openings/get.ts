import {
  EntityViewQuerySchema,
  OpeningSchema,
  RoleSchema,
} from "isomorphic-blocs/src/generated/prisma"
import type { DB, Opening } from "isomorphic-blocs/src/kysely"
import { EntityType, type Role } from "isomorphic-blocs/src/prisma"
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
        tags: ["Opening"],
        operationId: "Get openings",
        description: "Returns the current workspace's openings",
        querystring: EntityViewQuerySchema,
        response: {
          200: {
            type: "array",
            items: {
              ...OpeningSchema,
              required: [
                ...OpeningSchema.required,
                "role",
                "applicationsCount",
              ],
              properties: {
                ...OpeningSchema.properties,
                role: RoleSchema,
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

      const query = fastify.kysely.selectFrom("Opening as e").selectAll("e")
      const roleFields = fastify.prisma.role.fields

      let qb = fastify.services.entity.findEntities({
        entityType: EntityType.Opening,
        options: { filters: filters ?? [], sorts: sorts ?? [] },
        qb: query,
      }) as typeof query

      qb = qb.where("e.workspaceId", "=", workspaceId)

      // Add count of applications
      qb = qb.select((eb) => {
        return eb
          .selectFrom("Application")
          .select((eb) => eb.fn.count("Application.id").as("count"))
          .whereRef("e.id", "=", "Application.openingId")
          .as("applicationsCount")
      })

      // if (request.query.include) {
      qb = qb
        .innerJoin("Role", (join) => {
          return join.onRef("Role.id", "=", "e.roleId")
        })
        .select((eb) => {
          const buildObject = Object.keys(roleFields).reduce(
            (acc, key) => {
              acc[key] = eb.ref(
                `Role.${key}` as StringReference<
                  DB & { e: Opening },
                  "Role" | "e"
                >,
              )
              return acc
            },
            {} as Record<
              string,
              ExpressionWrapper<DB & { e: Opening }, "Role" | "e", unknown>
            >,
          )

          return jsonBuildObject(buildObject).as("role")
        })
        .where("e.deletedAt", "is", null)

      const openings = (await qb.execute()) as unknown as (Opening & {
        role: Role
        applicationsCount: number
      })[]

      const [_openings, roles] = await Promise.all([
        fastify.services.entity.mergeAttributes(openings, EntityType.Opening),
        fastify.services.entity.mergeAttributes(
          openings.map((opening) => opening.role),
          EntityType.Role,
        ),
      ])

      return _openings.map((opening) => ({
        ...opening,
        role: roles.find((role) => role.id === opening.roleId) ?? opening.role,
        applicationsCount: opening.applicationsCount ?? 0,
      }))
    },
  )
}
