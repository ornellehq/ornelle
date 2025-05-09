import crypto from "node:crypto"
import { WorkspaceSchema } from "isomorphic-blocs/src/generated/prisma"
import { defaultApplicationStatuses } from "lib/src/data/default-application-statuses"
import { slugify } from "lib/src/utils/slugify"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [fastify.authenticate.forUser],
      schema: {
        tags: ["Workspace"],
        operationId: "Create workspace",
        description: "Creates a workspace for the current user",
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
            },
          },
        },
        response: {
          200: WorkspaceSchema,
        },
      },
    },
    async (request, reply) => {
      const { email } = request.user
      const { name } = request.body

      const nameSlug = slugify(name)

      const user = await fastify.services.user.findUser({ email })

      // This shouldn't happen but ...
      if (!user) return reply.internalServerError()

      const { workspace, profile } = await fastify.prisma.$transaction(
        async (prisma) => {
          let workspace: Awaited<
            ReturnType<typeof prisma.workspace.create>
          > | null = null
          let attempt = 0
          const maxAttempts = 5
          const baseSlug = `${nameSlug}`

          while (!workspace && attempt < maxAttempts) {
            const url =
              attempt === 0
                ? baseSlug
                : `${baseSlug}-${crypto.randomBytes(2).toString("hex")}`
            try {
              workspace = await fastify.prisma.workspace.create({
                data: {
                  name,
                  url,
                  creatorId: user.id,
                  applicationStatuses: {
                    createMany: {
                      data: defaultApplicationStatuses.map((status) => ({
                        category:
                          status.category === "Not started"
                            ? "NotStarted"
                            : status.category === "In Progress"
                              ? "Started"
                              : "Completed",
                        name: status.name,
                        description: status.description,
                        color: status.colorCode,
                        isOutOfTheBox: true,
                      })),
                    },
                  },
                },
              })
            } catch (e) {
              fastify.log.warn(
                `Error creating workspace, attempt ${attempt}: ${String(e)}`,
              )
              attempt++
              // if (
              //   e instanceof Error &&
              //   e.message.includes("Unique constraint failed")
              // ) {

              // } else {
              //   fastify.log.error(`Error creating workspace: ${String(e)}`)
              //   // attempt = maxAttempts
              // }
            }
          }

          if (!workspace) {
            return reply.internalServerError(
              `Failed to create workspace after ${maxAttempts} attempts`,
            )
          }

          const profile = await prisma.profile.create({
            data: {
              workspace: { connect: { id: workspace.id } },
              firstName: user.firstName,
              lastName: "",
              displayName: user.firstName,
              user: { connect: { email } },
            },
          })

          // Generate email address for the profile using the email service

          return { workspace, profile }
        },
      )

      await fastify.services.email.generateEmailAddress({
        profileId: profile.id,
        workspaceId: workspace.id,
      })

      return workspace
    },
  )
}
