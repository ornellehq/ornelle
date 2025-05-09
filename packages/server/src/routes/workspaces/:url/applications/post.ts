import { PassThrough } from "node:stream"
import { ApplicationStatusCategory } from "isomorphic-blocs/src/kysely"
import type { File } from "isomorphic-blocs/src/prisma"

export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      preValidation: [fastify.authenticate.forPagesService],
      schema: {
        tags: ["Listings"],
        operationId: "Create application",
        description: "Create's an application",
        params: {
          type: "object",
          required: ["url"],
          properties: {
            url: {
              type: "string",
            },
          },
        },
        // body: {
        //   type: "object",
        //   required: [
        //     "openingId",
        //     "email",
        //     "responses",
        //     "firstName",
        //     "lastName",
        //     "file"
        //   ],
        //   properties: {
        //     file: {
        //       type: "object"
        //     },
        //     openingId: {
        //       type: "string",
        //     },
        //     email: {
        //       type: "string",
        //     },
        //     responses: {},
        //     firstName: {
        //       type: "string",
        //     },
        //     lastName: {
        //       type: "string",
        //     },
        //     resumeLink: {
        //       type: "string",
        //     },
        //   },
        // },
        // response: {
        //   200: ApplicationSchema,
        // },
      },
    },
    async (request) => {
      const { url } = request.params
      const workspace = await fastify.prisma.workspace.findUnique({
        where: {
          url,
        },
      })

      if (!workspace) return fastify.httpErrors.notFound()

      const workspaceId = workspace?.id

      const builtIns = {
        openingId: "",
        email: "",
        responses: {},
        lastName: "",
        firstName: "",
        file: undefined as File | undefined,
      }
      const data = {
        ...builtIns,
      }
      const parts = request.parts({
        headers: Object.assign({}, request.headers),
      })
      for await (const part of parts) {
        if (part.type === "file") {
          const fileData = part
          if (!fileData) return fastify.httpErrors.badRequest()

          // Create a pass-through stream for the file
          const stream = new PassThrough()
          fileData.file.pipe(stream)

          // Use FileService to upload the file
          const file = await fastify.services.file
            .uploadFile({
              workspaceId,
              entityType: "application",
              fileData: {
                stream,
                name: fileData.filename,
                mime: fileData.mimetype,
                size: "size" in fileData ? (fileData.size as number) : 0,
              },
            })
            .catch((err) => {
              console.error("Error uploading file:", err)
              throw fastify.httpErrors.serviceUnavailable()
            })

          data.file = file
        } else {
          // @ts-ignore
          data[part.fieldname] = part.value
        }
      }

      return fastify.prisma.$transaction(async (prisma) => {
        if (
          !data.file ||
          !data.openingId ||
          !data.email ||
          !data.lastName ||
          !data.firstName
        )
          return fastify.httpErrors.badRequest()

        const [lastApplication, lastCandidate] = await Promise.all([
          prisma.application.findFirst({
            where: {
              workspaceId,
            },
            orderBy: {
              numberInWorkspace: "desc",
            },
          }),
          prisma.candidate.findFirst({
            where: {
              workspaceId,
            },
            orderBy: {
              numberInWorkspace: "desc",
            },
          }),
        ])

        const status = await prisma.applicationStatus.findFirst({
          where: {
            workspaceId,
            category: ApplicationStatusCategory.NotStarted,
          },
        })

        const application = await prisma.application.create({
          data: {
            resumeLink: fastify.services.file.getFileUrl({
              path: data.file.path,
            }),
            resumeText: "",
            responses: data.responses as object,
            numberInWorkspace: lastApplication
              ? lastApplication.numberInWorkspace + 1
              : 100001,
            candidate: {
              connectOrCreate: {
                where: {
                  workspaceId_email: {
                    workspaceId: workspace.id,
                    email: data.email,
                  },
                },
                create: {
                  email: data.email,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  workspaceId: workspace.id,
                  numberInWorkspace: lastCandidate
                    ? lastCandidate.numberInWorkspace + 1
                    : 100001,
                },
              },
            },
            workspace: {
              connect: {
                url,
              },
            },
            opening: {
              connect: {
                id: data.openingId,
              },
            },
            status: {
              connect: {
                workspaceId: workspace.id,
                id: status?.id,
              },
            },
          },
        })

        const builtInPropertyNames = Object.keys(builtIns)
        const attributeIds = Object.keys(data).filter(
          (key) => !builtInPropertyNames.includes(key),
        )

        if (attributeIds.length) {
          const attributes = await prisma.attribute.findMany({
            where: {
              id: {
                in: attributeIds,
              },
            },
          })

          await Promise.all(
            attributes.map(async (attribute) => {
              const record = await prisma.attributeValue.upsert({
                where: {
                  attributeId_entityId: {
                    attributeId: attribute.id,
                    entityId:
                      attribute.entityType === "Application"
                        ? application.id
                        : application.candidateId,
                  },
                },
                create: {
                  entityId:
                    attribute.entityType === "Application"
                      ? application.id
                      : application.candidateId,
                  attributeId: attribute.id,
                  data: { value: data[attribute.id as keyof typeof data] },
                  workspaceId: workspace.id,
                },
                update: {
                  data: { value: data[attribute.id as keyof typeof data] },
                  workspaceId: workspace.id,
                },
              })
              return record
            }),
          )
        }

        return application
      })
    },
  )
}
