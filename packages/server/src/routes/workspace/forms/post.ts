import {
  FormFieldsSchema,
  FormSchemaWithOpenings,
} from "isomorphic-blocs/src/generated/prisma"
import { FormType } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [
        fastify.authenticate.forUser,
        fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Form"],
        operationId: "Create form",
        description: "Creates a form in the current workspace",
        body: {
          type: "object",
          required: ["title", "fields", "type"],
          properties: {
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            openings: {
              type: "array",
              items: {
                type: "string",
              },
            },
            fields: FormFieldsSchema,
            type: {
              type: "string",
              enum: Object.keys(FormType) as FormType[],
            },
          },
        },
        response: {
          200: FormSchemaWithOpenings,
        },
      },
    },
    async (request) => {
      const { id: workspaceId, profileId } = request.workspace

      const { title, description = "", fields, openings, type } = request.body
      const form = await fastify.prisma.form.create({
        data: {
          name: title,
          description,
          type,
          content: {
            json: fields,
            version: "1",
          },
          author: {
            connect: {
              id: profileId,
            },
          },
          workspace: {
            connect: {
              id: workspaceId,
            },
          },
          ...(openings?.length
            ? {
                openings: {
                  connect: openings?.map((id) => ({ id })),
                },
              }
            : {}),
        },
        include: {
          openings: true,
        },
      })

      return form
    },
  )
}
