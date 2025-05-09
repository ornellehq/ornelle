import {
  OpeningSchema,
  rteValueSchema,
} from "isomorphic-blocs/src/generated/prisma"
import { OpeningStatus } from "isomorphic-blocs/src/kysely"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.patch(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Opening"],
        operationId: "Update an opening",
        description: "Update an opening by ID",
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
          properties: {
            title: {
              type: "string",
            },
            description: rteValueSchema,
            role: {
              type: "string",
            },
            form: {
              type: "string",
            },
            status: {
              type: "string",
              enum: Object.keys(OpeningStatus) as OpeningStatus[],
            },
          },
        },
        response: {
          200: {
            ...OpeningSchema,
            required: [...OpeningSchema.required, "form"],
            properties: {
              ...OpeningSchema.properties,
              // form: FormSchema,
            },
          },
          404: { $ref: "HttpError" },
        },
      },
    },
    async (request) => {
      const { id: workspaceId } = request.workspace
      const { id } = request.params
      const { role, title, description, form, status } = request.body

      const opening = await fastify.prisma.opening.update({
        where: {
          id,
          workspace: {
            id: workspaceId,
          },
        },
        data: {
          ...(title ? { title } : {}),
          ...(description ? { description } : {}),
          ...(role ? { roleId: role } : {}),
          ...(form ? { formId: form } : {}),
          ...(status ? { status } : {}),
        },
        include: {
          form: true,
        },
      })

      return opening
    },
  )
}
