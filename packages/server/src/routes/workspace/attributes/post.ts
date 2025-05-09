import {
  AttributeConfigurationSchema,
  AttributeSchema,
} from "isomorphic-blocs/src/generated/prisma"
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
        tags: ["Attribute"],
        operationId: "Create attribute",
        description: "Creates an attribute in the current workspace",
        body: {
          type: "object",
          required: ["entity", "name", "configuration"],
          properties: {
            entity: {
              type: "string",
              enum: Object.keys(EntityType) as EntityType[],
            },
            name: {
              type: "string",
            },
            // type: {
            //   type: "string",
            //   enum: Object.keys(AttributeDataType) as AttributeDataType[],
            // },
            configuration: AttributeConfigurationSchema,
          },
        },
        response: {
          200: AttributeSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { email } = request.user
      const {
        name,
        entity,
        configuration: { type, ...configuration },
      } = request.body
      const profile = await fastify.prisma.profile.findFirst({
        where: {
          user: {
            email,
          },
        },
      })

      if (!profile)
        throw {
          statusCode: 404,
          message: "Profile not found",
        }

      const attribute = await fastify.prisma.attribute.create({
        data: {
          name,
          entityType: entity,
          dataType: type,
          builtIn: false,
          configuration,
          workspace: {
            connect: {
              id: workspaceId,
            },
          },
          creator: {
            connect: {
              id: profile.id,
            },
          },
        },
      })

      return attribute
    },
  )
}
