import { EntityViewQuerySchema } from "isomorphic-blocs/src/generated/prisma"
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
        tags: ["Role"],
        operationId: "Get roles",
        description: "Returns the current workspace's roles",
        querystring: EntityViewQuerySchema,
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "title", "description", "openingsCount"],
              additionalProperties: true,
              properties: {
                id: {
                  type: "string",
                },
                title: {
                  type: "string",
                },
                description: {
                  type: "object",
                  required: ["html", "json"],
                  properties: {
                    html: {
                      type: "string",
                    },
                    json: {
                      type: "object",
                    },
                  },
                },
                openingsCount: {
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

      const query = fastify.kysely.selectFrom("Role as e").selectAll("e")

      let qb = fastify.services.entity.findEntities({
        entityType: EntityType.Role,
        options: { filters: filters ?? [], sorts: sorts ?? [] },
        qb: query,
      }) as typeof query

      qb = qb
        .where("e.workspaceId", "=", workspaceId)
        .select((eb) => {
          return eb
            .selectFrom("Opening")
            .select((eb) => eb.fn.count("Opening.id").as("count"))
            .whereRef("e.id", "=", "Opening.roleId")
            .where("Opening.deletedAt", "is", null)
            .as("openingsCount")
        })
        .where("e.deletedAt", "is", null)

      const roles = await qb.execute()

      return fastify.services.entity.mergeAttributes(roles, EntityType.Role)
    },
  )
}
