import { AttributeValueSchema } from "isomorphic-blocs/src/generated/prisma"
import { ActionSource } from "isomorphic-blocs/src/prisma"

const attributeValueBodySchema = {
  type: "object",
  required: ["attributeId", "entityId", "data"],
  properties: {
    attributeId: {
      type: "string",
    },
    entityId: {
      type: "string",
    },
    data: {
      type: "object",
      required: ["value"],
      properties: {
        value: {},
      },
    },
  },
} as const

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.put(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Attribute value"],
        operationId: "Upsert attribute values",
        description: "Creates or updates one or more attribute values",
        body: {
          type: "array",
          items: attributeValueBodySchema,
        },
        response: {
          200: {
            type: "array",
            items: AttributeValueSchema,
          },
        },
      },
    },
    async (request) => {
      const { id: workspaceId, profileId } = request.workspace

      const attributes = Promise.all(
        (Array.isArray(request.body) ? request.body : [request.body]).map(
          async (body) => {
            const { entityId, attributeId, data } = body
            const [attribute, profile] = await Promise.all([
              fastify.prisma.attribute.findUnique({
                where: {
                  workspaceId,
                  id: attributeId,
                },
                include: {
                  attributeValues: {
                    where: {
                      entityId,
                      workspaceId,
                    },
                  },
                },
              }),
              fastify.prisma.profile.findUnique({
                where: {
                  workspaceId,
                  id: profileId,
                },
              }),
            ])

            if (!attribute) throw fastify.httpErrors.notFound()

            const [attributeValue, activity] =
              await fastify.prisma.$transaction([
                data.value
                  ? fastify.prisma.attributeValue.upsert({
                      where: {
                        workspace: {
                          id: workspaceId,
                        },
                        attributeId_entityId: {
                          attributeId,
                          entityId,
                        },
                      },
                      create: {
                        attribute: {
                          connect: {
                            id: attributeId,
                          },
                        },
                        entityId,
                        workspace: {
                          connect: {
                            id: workspaceId,
                          },
                        },
                        data,
                      },
                      update: {
                        data,
                      },
                    })
                  : fastify.prisma.attributeValue.delete({
                      where: {
                        workspace: {
                          id: workspaceId,
                        },
                        attributeId_entityId: {
                          attributeId,
                          entityId,
                        },
                      },
                    }),
                fastify.prisma.activity.create({
                  data: {
                    workspace: {
                      connect: {
                        id: workspaceId,
                      },
                    },
                    entityId,
                    entityType: attribute.entityType,
                    sourceId: profileId,
                    source: ActionSource.Profile,
                    metadata: {
                      attributeId,
                      attributeName: attribute.name,
                      attributeDataType: attribute.dataType,
                      sourceName: profile?.displayName || profile?.firstName,
                    },
                    previousValue: {
                      ...(attribute.attributeValues[0]?.data ?? {}),
                    },
                    newValue: {
                      ...(data as object),
                    },
                  },
                }),
              ])

            return attributeValue
          },
        ),
      )

      return attributes
    },
  )
}
