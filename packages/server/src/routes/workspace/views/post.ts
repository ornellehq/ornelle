import { ViewSchema } from "isomorphic-blocs/src/generated/prisma"
import { EntityType } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["View"],
        operationId: "Create view",
        description: "Creates a view in the current workspace",
        body: {
          type: "object",
          required: ["name", "public", "entityType", "config"],
          properties: {
            name: {
              type: "string",
            },
            description: {
              type: "string",
            },
            public: {
              type: "boolean",
            },
            entityType: {
              type: "string",
              enum: Object.keys(EntityType) as EntityType[],
            },
            config: {},
          },
        },
        response: {
          200: ViewSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId, profileId } = request.workspace
      const {
        name,
        description = "",
        public: isPublic,
        entityType,
        config,
      } = request.body
      const view = await fastify.prisma.view.create({
        data: {
          name,
          description,
          config,
          entityType,
          public: isPublic,
          workspaceId,
          creatorId: profileId,
        },
      })

      return view
    },
  )
}
