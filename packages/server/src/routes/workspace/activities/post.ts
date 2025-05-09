import { ActivitySchema } from "isomorphic-blocs/src/generated/prisma"
import {
  ActionSource,
  ActivityType,
  EntityType,
} from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Activity"],
        operationId: "Create activity",
        description: "Creates an activity in the current workspace",
        body: {
          type: "object",
          required: ["entityType", "entityId", "type"],
          properties: {
            type: {
              type: "string",
              enum: Object.keys(ActivityType) as ActivityType[],
            },
            entityType: {
              type: "string",
              enum: Object.keys(EntityType) as EntityType[],
            },
            entityId: {
              type: "string",
            },
            previousValue: {},
            newValue: {},
            metadata: {},
          },
        },
        response: {
          200: ActivitySchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId, profileId } = request.workspace
      const { entityId, entityType, previousValue, newValue, metadata, type } =
        request.body
      const activity = await fastify.prisma.activity.create({
        data: {
          workspaceId,
          sourceId: profileId,
          source: ActionSource.Profile,
          entityType,
          entityId,
          previousValue,
          newValue,
          metadata,
          type,
        },
      })

      return activity
    },
  )
}
