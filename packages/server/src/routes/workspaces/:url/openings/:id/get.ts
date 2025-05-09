import {
  ApplicationSchema,
  FormSchema,
  OpeningSchema,
  RoleSchema,
} from "isomorphic-blocs/src/generated/prisma"
import { EntityType } from "isomorphic-blocs/src/prisma"
import type { FormField } from "isomorphic-blocs/src/types/form"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        // fastify.authenticate.forUser,
        // fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["Listings"],
        operationId: "Get opening",
        description: "Returns a specific opening by id",
        params: {
          type: "object",
          required: ["url", "id"],
          properties: {
            id: {
              type: "string",
            },
            url: {
              type: "string",
            },
          },
        },
        querystring: {
          type: "object",
          required: [],
          properties: {
            email: {
              type: "string",
            },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["opening", "workspace", "content", "propertiesToShow"],
            properties: {
              workspace: {
                type: "object",
                required: ["name"],
                properties: {
                  name: {
                    type: "string",
                  },
                  logo: {
                    type: "string",
                  },
                },
              },
              content: {
                type: "object",
                required: ["html", "json"],
                properties: {
                  html: {
                    type: "string",
                  },
                  json: {},
                },
              },
              opening: {
                ...OpeningSchema,
                required: [...OpeningSchema.required, "form", "role"],
                properties: {
                  ...OpeningSchema.properties,
                  form: {
                    ...FormSchema,
                    required: FormSchema.required.filter(
                      (prop) => prop !== "openings",
                    ),
                  },
                  role: RoleSchema,
                },
              },
              propertiesToShow: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              application: ApplicationSchema,
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { url, id } = request.params
      const { email: applicantEmail } = request.query
      const [workspace, listingTheme, opening] =
        await fastify.prisma.$transaction([
          fastify.prisma.workspace.findUnique({
            where: {
              url,
            },
            select: {
              name: true,
              logoSlug: true,
            },
          }),
          fastify.prisma.listingTheme.findFirst({
            where: {
              key: "default",
              workspace: {
                url,
              },
            },
          }),
          fastify.prisma.opening.findUnique({
            where: {
              id,
              workspace: {
                url,
              },
            },
            include: {
              role: true,
              form: true,
            },
          }),
        ])

      if (!opening) return fastify.httpErrors.notFound()

      if (opening.form) {
        const json = (opening.form.content as { json: FormField[] })?.json ?? []

        opening.form.content = {
          ...(opening.form.content ?? {}),
          json: await Promise.all(
            json.map(async (field) => {
              if (
                field.attributeLinked &&
                field.attributeLinked.type === "custom"
              ) {
                const attribute = await fastify.prisma.attribute.findUnique({
                  where: {
                    id: field.attributeLinked.id,
                  },
                })
                return {
                  ...field,
                  attributeLinked: {
                    ...field.attributeLinked,
                    attributeConfiguration: attribute?.configuration,
                  },
                }
              }
              return field
            }),
          ),
        }
      }

      const openingConfig = listingTheme?.openingConfig as {
        content?: { html: string; json: object }
        propertiesToShow?: string[]
      }
      const logoSlug = workspace?.logoSlug

      const application = applicantEmail
        ? await (async () => {
            const application = await fastify.prisma.application.findFirst({
              where: {
                openingId: id,
                candidate: {
                  email: applicantEmail,
                },
              },
            })
            return application
          })()
        : null

      reply.send({
        workspace: {
          ...workspace,
          logo: logoSlug
            ? `//${request.hostname}/workspace/files/${logoSlug}`
            : undefined,
        },
        content: {
          html: openingConfig?.content?.html ?? "",
          json: openingConfig?.content?.json ?? {},
        },
        opening: {
          ...(
            await fastify.services.entity.mergeAttributes(
              [opening],
              EntityType.Opening,
            )
          )[0],
          role: (
            await fastify.services.entity.mergeAttributes(
              [opening.role],
              EntityType.Role,
            )
          )[0],
        },
        propertiesToShow: openingConfig.propertiesToShow ?? [],
        ...(application ? { application } : {}),
      })
    },
  )
}
