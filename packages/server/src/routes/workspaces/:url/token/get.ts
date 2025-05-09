import {
  ApplicationStatusSchema,
  EmailAddressSchema,
  ProfileSchema,
  WorkspaceSchema,
} from "isomorphic-blocs/src/generated/prisma"
import env from "~/env"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [fastify.authenticate.forUser],
      schema: {
        tags: ["Workspace"],
        operationId: "Get workspace auth token",
        description: "Authenticate a user for workspace access",
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
            required: ["data", "meta"],
            properties: {
              data: {
                type: "object",
                required: ["token"],
                properties: {
                  token: {
                    type: "string",
                  },
                },
              },
              meta: {
                type: "object",
                required: ["workspace"],
                properties: {
                  workspace: {
                    ...WorkspaceSchema,
                    required: [
                      ...WorkspaceSchema.required,
                      "members",
                      "applicationStatuses",
                    ],
                    properties: {
                      ...WorkspaceSchema.properties,
                      members: {
                        type: "array",
                        items: {
                          ...ProfileSchema,
                          required: [
                            ...ProfileSchema.required,
                            "emailAddresses",
                          ],
                          properties: {
                            ...ProfileSchema.properties,
                            emailAddresses: {
                              type: "array",
                              items: EmailAddressSchema,
                            },
                          },
                        },
                      },
                      applicationStatuses: {
                        type: "array",
                        items: ApplicationStatusSchema,
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "HttpError" },
          500: { $ref: "HttpError" },
        },
      },
      config: {
        rateLimit: {
          keyGenerator: (request) => {
            const { email } = request.query as { email: string }
            return `fastify-rate-limit:${email}`
          },
          timeWindow: "10 minutes",
          max: 20,
        },
      },
    },
    async (request, reply) => {
      const { email } = request.user
      const { url } = request.params
      const { services } = fastify
      const workspace = await fastify.prisma.workspace.findUnique({
        where: {
          url,
          members: {
            some: {
              user: {
                email,
              },
            },
          },
        },
        include: {
          members: {
            where: {
              user: {
                email,
              },
            },
            include: {
              emailAddresses: {
                where: {
                  isActive: true,
                  deletedAt: null,
                },
              },
            },
          },
          applicationStatuses: true,
        },
      })

      if (!workspace)
        return reply.unauthorized(
          "The workspace URL is either not correct or you do not have access to it.",
        )

      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const profile = workspace.members[0]!
      const token = await services.workspace.signWorkspace({
        id: workspace.id,
        profileId: profile.id,
      })

      if (env.Storage.provider === "aws") {
        services.aws.setSignedCookiesInReply(reply, {
          resourcePaths: ["/*"],
        })
      }

      return {
        data: { token },
        meta: {
          workspace,
        },
      }
    },
  )
}
