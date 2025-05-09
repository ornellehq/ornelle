import { createWriteStream, unlinkSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import path from "node:path"
import { pipeline } from "node:stream/promises"
import type { Multipart, MultipartValue } from "@fastify/multipart"
import { createId } from "@paralleldrive/cuid2"
import {
  ApplicationStatusCategory,
  type File,
} from "isomorphic-blocs/src/prisma"
import { slugify } from "lib/src/utils/slugify"
import { rootDir } from "~/config"

// Interfaces for application creation
export interface ApplicationFileData {
  filename: string
  mimetype: string
  fieldname: string
  file: NodeJS.ReadableStream
  size?: number
}

export interface ApplicationCreationData {
  openingId: string
  email: string
  firstName: string
  lastName: string
  responses: Record<string, unknown>
  file?: ApplicationFileData
}

export interface ApplicationCreationResult {
  id: string
  numberInWorkspace: number
  resumeLink: string
  email: string
  firstName: string
  lastName: string
  createdAt: Date
}

export class ApplicationService {
  private fastify: FastifyWithSchemaProvider

  constructor(fastify: FastifyWithSchemaProvider) {
    this.fastify = fastify
  }

  /**
   * Creates a new application
   *
   * @param workspaceId The ID of the workspace
   * @param data Application data including candidate info and resume
   * @returns Created application
   */
  async createApplication(
    workspaceId: string,
    data: ApplicationCreationData,
  ): Promise<ApplicationCreationResult> {
    // Upload file and create file record if file is provided
    let fileRecord: File | undefined

    if (data.file) {
      const fileId = createId()
      fileRecord = await this.uploadFile(workspaceId, fileId, data.file)
    }

    return this.fastify.prisma.$transaction(async (prisma) => {
      if (!fileRecord) {
        throw this.fastify.httpErrors.badRequest("File is required")
      }

      // Get the last application and candidate for numbering
      const [lastApplication, lastCandidate] = await Promise.all([
        prisma.application.findFirst({
          where: { workspaceId },
          orderBy: { numberInWorkspace: "desc" },
        }),
        prisma.candidate.findFirst({
          where: { workspaceId },
          orderBy: { numberInWorkspace: "desc" },
        }),
      ])

      // Find the initial status for the application
      const status = await prisma.applicationStatus.findFirst({
        where: {
          workspaceId,
          category: ApplicationStatusCategory.NotStarted,
        },
      })

      if (!status) {
        throw this.fastify.httpErrors.internalServerError(
          "No initial status found",
        )
      }

      // Create the application
      const application = await prisma.application.create({
        data: {
          resumeLink: fileRecord.slug,
          resumeText: "",
          responses: data.responses,
          numberInWorkspace: lastApplication
            ? lastApplication.numberInWorkspace + 1
            : 100001,
          candidate: {
            connectOrCreate: {
              where: {
                workspaceId_email: {
                  workspaceId,
                  email: data.email,
                },
              },
              create: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                workspaceId,
                numberInWorkspace: lastCandidate
                  ? lastCandidate.numberInWorkspace + 1
                  : 100001,
              },
            },
          },
          workspace: {
            connect: {
              id: workspaceId,
            },
          },
          opening: {
            connect: {
              id: data.openingId,
            },
          },
          status: {
            connect: {
              id: status.id,
            },
          },
        },
        select: {
          id: true,
          numberInWorkspace: true,
          resumeLink: true,
          createdAt: true,
          candidate: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      })

      return {
        id: application.id,
        numberInWorkspace: application.numberInWorkspace,
        resumeLink: application.resumeLink,
        email: application.candidate.email,
        firstName: application.candidate.firstName,
        lastName: application.candidate.lastName,
        createdAt: application.createdAt,
      }
    })
  }

  /**
   * Process multipart form data to extract application details
   *
   * @param parts Multipart form data parts
   * @returns Parsed application data
   */
  async processApplicationMultipart(
    parts: AsyncIterableIterator<
      (Multipart | MultipartValue<ApplicationCreationData>) & { size: number }
    >,
  ): Promise<ApplicationCreationData> {
    const data: Partial<ApplicationCreationData> = {
      openingId: "",
      email: "",
      responses: {},
      lastName: "",
      firstName: "",
    }

    let fileData: ApplicationFileData | undefined

    for await (const part of parts) {
      if (part.type === "file") {
        fileData = {
          filename: part.filename,
          mimetype: part.mimetype,
          fieldname: part.fieldname,
          file: part.file,
          size: part.size,
        }
      } else {
        // Handle form fields
        if (part.fieldname === "responses" && typeof part.value === "string") {
          try {
            data[part.fieldname] = JSON.parse(part.value)
          } catch (err) {
            data[part.fieldname] = {}
          }
        } else {
          // @ts-ignore
          data[part.fieldname] = part.value
        }
      }
    }

    if (fileData) {
      data.file = fileData
    }

    // Validate required fields
    if (!data.openingId || !data.email || !data.firstName || !data.lastName) {
      throw this.fastify.httpErrors.badRequest("Missing required fields")
    }

    return data as ApplicationCreationData
  }

  /**
   * Upload a file and create a file record
   *
   * @param workspaceId Workspace ID
   * @param fileId File ID
   * @param fileData File data
   * @returns Created file record
   */
  private async uploadFile(
    workspaceId: string,
    fileId: string,
    fileData: ApplicationFileData,
  ): Promise<File> {
    if (!fileData) {
      throw this.fastify.httpErrors.badRequest("No file provided")
    }

    // Get file extension from name
    const fileExtension = fileData.filename.split(".").slice(-1)[0]

    // Files will be stored in the folder format: t/d/z/tdzjfdsindjsng/k/l/i/klifdjfnsjfkdfgfds/
    const filePath = `${workspaceId.substring(0, 3).split("").join("/")}/${workspaceId}/${fileId.substring(0, 3).split("").join("/")}/${fileId}`
    const storagePath = path.resolve(
      rootDir,
      "../..",
      "uploads",
      filePath,
      `original.${fileExtension}`,
    )

    try {
      await mkdir(path.resolve(storagePath, ".."), { recursive: true })
      await pipeline(fileData.file, createWriteStream(storagePath))

      const file = await this.fastify.prisma.file.create({
        data: {
          workspaceId,
          id: fileId,
          name: fileData.filename,
          slug: `${slugify(fileData.fieldname)}-${createId()}`,
          path: filePath,
          mime: fileData.mimetype,
          size: "size" in fileData ? (fileData.size as number) : 0,
        },
      })

      return file
    } catch (error) {
      // Clean up file if created
      try {
        unlinkSync(storagePath)
      } catch (e) {
        // Ignore error if file doesn't exist
      }
      throw this.fastify.httpErrors.serviceUnavailable("Failed to upload file")
    }
  }
}
