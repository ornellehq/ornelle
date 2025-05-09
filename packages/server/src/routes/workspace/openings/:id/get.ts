import {
  FormSchema,
  OpeningSchema,
} from "isomorphic-blocs/src/generated/prisma"
import { EntityType } from "isomorphic-blocs/src/prisma"

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
        operationId: "Get opening",
        description: "Return an opening by ID",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },
        response: {
          200: {
            ...OpeningSchema,
            required: [...OpeningSchema.required, "form"],
            additionalProperties: true,
            properties: {
              ...OpeningSchema.properties,
              form: FormSchema,
            },
          },
          404: { $ref: "HttpError" },
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params

      const opening = await fastify.prisma.opening.findUnique({
        where: {
          id,
          workspaceId,
          deletedAt: null,
        },
        include: {
          form: true,
        },
      })

      if (!opening) return reply.notFound()

      return (
        await fastify.services.entity.mergeAttributes(
          [opening],
          EntityType.Opening,
        )
      )[0]
    },
  )
}
