import {
  OpeningSchema,
  RoleSchema,
} from "isomorphic-blocs/src/generated/prisma"
import { EntityType } from "isomorphic-blocs/src/prisma"

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
        operationId: "Get landing data",
        description: "Returns data for the workspace's job board landing page",
        params: {
          type: "object",
          required: ["url"],
          properties: {
            url: {
              type: "string",
            },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["content", "openings", "workspace"],
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
              openings: {
                type: "array",
                items: {
                  ...OpeningSchema,
                  properties: {
                    ...OpeningSchema.properties,
                    role: RoleSchema,
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request) => {
      const { url } = request.params
      const [workspace, listingTheme, openings] =
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
          fastify.prisma.opening.findMany({
            where: {
              workspace: {
                url,
              },
            },
            include: {
              role: true,
            },
          }),
        ])

      const openingsConfig = listingTheme?.openingsConfig as {
        content?: { html: string; json: object }
      }

      const [_openings, roles] = await Promise.all([
        fastify.services.entity.mergeAttributes(openings, EntityType.Opening),
        fastify.services.entity.mergeAttributes(
          openings.map((opening) => opening.role),
          EntityType.Role,
        ),
      ])

      const logoSlug = workspace?.logoSlug
      // const logoFile = logoSlug ? await (async () => {
      //   return fastify.prisma.file.findUnique({where: {slug: logoSlug}})
      // })() : null

      return {
        workspace: {
          ...workspace,
          logo: logoSlug
            ? `//${request.hostname}/workspace/files/${logoSlug}`
            : undefined,
        },
        content: {
          html: openingsConfig?.content?.html ?? "",
          json: openingsConfig?.content?.json ?? {},
        },
        openings: _openings.map((opening) => ({
          ...opening,
          role:
            roles.find((role) => role.id === opening.roleId) ?? opening.role,
        })),
      }
    },
  )
}
