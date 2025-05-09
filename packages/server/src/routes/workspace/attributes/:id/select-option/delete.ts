import {
  type AttributeConfigurationSchema,
  AttributeSchema,
} from "isomorphic-blocs/src/generated/prisma"
import type { FromSchema } from "json-schema-to-ts"
import { sql } from "kysely"

type CreateAttributeRequestConfigurationAnyOf4 = FromSchema<
  (typeof AttributeConfigurationSchema)["anyOf"][4]
>

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.delete(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Attribute"],
        operationId: "Delete select option",
        description: "Deletes a select option from its attribute configuration",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },
        body: {
          type: "object",
          required: ["option"],
          properties: {
            option: {
              type: "string",
            },
          },
        },
        response: {
          200: AttributeSchema,
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params
      const { option } = request.body

      const attribute = await fastify.prisma.attribute.findUnique({
        where: {
          id,
          workspaceId,
        },
      })

      if (!attribute) throw fastify.httpErrors.notFound()

      const configuration =
        attribute.configuration as CreateAttributeRequestConfigurationAnyOf4

      const updated = await fastify.prisma.$transaction(async (prisma) => {
        const updated = await prisma.attribute.update({
          where: {
            id,
            workspaceId,
          },
          data: {
            configuration: {
              ...configuration,
              options: configuration.options.filter(
                (_option) => _option !== option,
              ),
            },
          },
        })

        // Delete attribute values with exact match to the option
        await prisma.attributeValue.deleteMany({
          where: {
            attributeId: id,
            workspaceId,
            data: {
              path: ["value"],
              equals: option,
            },
            // OR: [
            //   {
            //     data: {
            //       path: ["value"],
            //       equals: option,
            //     },
            //   },
            //   {
            //     data: {
            //       path: ["value"],
            //       array_starts_with: option,
            //       array_ends_with: option,
            //     },
            //   },
            // ],
          },
        })

        // Use kysely to update attribute values that have the option in an array
        await fastify.kysely
          .updateTable("AttributeValue")
          .set({
            data: sql`jsonb_set(
              data, 
              '{value}', 
              COALESCE(
                (
                  SELECT CASE 
                    WHEN count(*) = 0 THEN '[]'::jsonb 
                    ELSE jsonb_agg(elem) 
                  END
                  FROM jsonb_array_elements(data->'value') AS elem
                  WHERE elem::text <> ${JSON.stringify(option)}::text
                ),
                '[]'::jsonb
              )
            )`,
            updatedAt: new Date(),
          })
          .where("attributeId", "=", id)
          .where("workspaceId", "=", workspaceId)
          .where(sql`jsonb_typeof(data->'value') = 'array'`)
          .where(sql`data->'value' @> ${JSON.stringify([option])}::jsonb`)
          .execute()

        return updated
      })

      return updated
    },
  )
}
