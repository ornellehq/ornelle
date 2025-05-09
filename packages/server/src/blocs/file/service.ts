import { createWriteStream, unlinkSync, writeFileSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import path from "node:path"
import { PassThrough, type Readable } from "node:stream"
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { createId } from "@paralleldrive/cuid2"
import { slugify } from "lib/src/utils/slugify"
import sharp from "sharp"
import { rootDir } from "~/config"
import env from "~/env"

export interface FileUploadData {
  base64?: string
  stream?: Readable
  name: string
  mime: string
  size: number
}

export interface FileUploadOptions {
  workspaceId: string
  entityId?: string
  entityType?: string
  fileData: FileUploadData
  previousSlug?: string | null
}

export class FileService {
  private s3Client: S3Client | null = null

  constructor(private fastify: FastifyWithSchemaProvider) {
    // Initialize S3 client if using AWS storage
    if (env.Storage.provider === "aws") {
      this.s3Client = new S3Client({
        region: env.Storage.aws.Region,
        credentials: {
          accessKeyId: env.Storage.aws.S3AccessKey,
          secretAccessKey: env.Storage.aws.S3SecretKey,
        },
      })
    }
  }

  /**
   * Upload a file to either AWS S3 or local storage based on environment configuration
   */
  async uploadFile({ workspaceId, fileData, previousSlug }: FileUploadOptions) {
    const fileId = createId()
    // Generate a unique slug for the file
    const fileSlug = createId()

    // Convert workspaceId to base64
    const workspaceIdBase64 = Buffer.from(workspaceId).toString("base64")

    // Construct file path based on entity type and ID
    let filePath = `${workspaceIdBase64.substring(0, 3).split("").join("/")}/${workspaceIdBase64}`

    // // Add entity type and ID to path if provided
    // if (entityType && entityId) {
    //   filePath += `/${entityType}/${entityId}`
    // }

    filePath += `/${fileSlug.substring(0, 3).split("").join("/")}/${fileSlug}`

    // Keep the original file name
    const fileName = fileData.name
    const fileExtension = fileName.split(".").slice(-1)[0]
    const fullPath = `${filePath}/${fileName}`

    try {
      // Upload file to the configured storage provider
      if (env.Storage.provider === "aws") {
        await this.uploadToAwsS3(fileData, fullPath)
      } else {
        await this.uploadToLocal(fileData, filePath, fileExtension)
      }

      // Handle file operations in a transaction
      const [newFile, deletedFile] = await this.fastify.prisma.$transaction([
        // Create new file record
        this.fastify.prisma.file.create({
          data: {
            workspaceId,
            id: fileId,
            name: fileData.name,
            slug: `${slugify(fileData.name)}-${createId()}`,
            path: fullPath,
            mime: fileData.mime,
            size: fileData.size,
          },
        }),
        // Delete previous file if exists
        ...(previousSlug
          ? [
              this.fastify.prisma.file.delete({
                where: {
                  slug: previousSlug,
                },
              }),
            ]
          : []),
      ])

      // Delete physical file if previous file was deleted
      if (deletedFile) {
        if (env.Storage.provider === "aws") {
          // Get original filename from the deleted file's name
          await this.deleteFromAwsS3(`${deletedFile.path}/${deletedFile.name}`)
        } else {
          try {
            unlinkSync(
              path.resolve(
                rootDir,
                "../..",
                "uploads",
                deletedFile.path,
                deletedFile.name,
              ),
            )
          } catch (err) {
            console.error("Error deleting previous file:", err)
          }
        }
      }

      return newFile
    } catch (err) {
      console.error("Error handling file upload:", err)
      // Clean up the uploaded file if there was an error
      if (env.Storage.provider === "local") {
        const storagePath = path.resolve(
          rootDir,
          "../..",
          "uploads",
          filePath,
          fileData.name,
        )
        try {
          unlinkSync(storagePath)
        } catch (cleanupErr) {
          console.error(
            "Error cleaning up file after failed upload:",
            cleanupErr,
          )
        }
      } else if (env.Storage.provider === "aws") {
        await this.deleteFromAwsS3(fullPath).catch((err) => {
          console.error("Error deleting file from S3 after failed upload:", err)
        })
      }
      throw this.fastify.httpErrors.serviceUnavailable()
    }
  }

  /**
   * Upload a file to AWS S3
   */
  private async uploadToAwsS3(
    fileData: FileUploadData,
    fullPath: string,
  ): Promise<void> {
    if (!this.s3Client) {
      throw new Error("S3 client not initialized")
    }

    let body: Buffer | Readable

    if (fileData.base64) {
      // Handle base64 upload
      body = Buffer.from(
        fileData.base64.replace(/^data:[^;]+;base64,/, ""),
        "base64",
      )
    } else if (fileData.stream) {
      // Handle stream upload
      body = fileData.stream
    } else {
      throw new Error(
        "Either base64 or stream must be provided for file upload",
      )
    }

    const command = new PutObjectCommand({
      Bucket: env.Storage.aws.Bucket,
      Key: fullPath,
      Body: body,
      ContentType: fileData.mime,
    })

    await this.s3Client.send(command)
  }

  /**
   * Delete a file from AWS S3
   */
  private async deleteFromAwsS3(fullPath: string): Promise<void> {
    if (!this.s3Client) {
      throw new Error("S3 client not initialized")
    }

    const command = new DeleteObjectCommand({
      Bucket: env.Storage.aws.Bucket,
      Key: fullPath,
    })

    await this.s3Client.send(command)
  }

  /**
   * Upload a file to local storage
   */
  private async uploadToLocal(
    fileData: FileUploadData,
    filePath: string,
    fileExtension: string,
  ): Promise<void> {
    const storagePath = path.resolve(
      rootDir,
      "../..",
      "uploads",
      filePath,
      fileData.name,
    )

    // Create directory structure
    await mkdir(path.resolve(storagePath, ".."), { recursive: true })

    if (fileData.base64) {
      // Handle base64 upload
      const buffer = Buffer.from(
        fileData.base64.replace(/^data:[^;]+;base64,/, ""),
        "base64",
      )

      // Process image if it's an image file
      if (fileData.mime.startsWith("image/")) {
        await sharp(buffer)
          .resize({ width: 512 })
          .jpeg({ quality: 70 })
          .toFile(storagePath)
      } else {
        // For non-image files, write the buffer directly
        writeFileSync(storagePath, buffer)
      }
    } else if (fileData.stream) {
      // Handle stream upload
      const passThrough = new PassThrough()
      const writeStream = createWriteStream(storagePath)

      // Pipe the stream to the file
      fileData.stream.pipe(passThrough).pipe(writeStream)

      // Return a promise that resolves when the stream is finished
      return new Promise((resolve, reject) => {
        writeStream.on("finish", resolve)
        writeStream.on("error", reject)
      })
    } else {
      throw new Error(
        "Either base64 or stream must be provided for file upload",
      )
    }
  }

  /**
   * Get the URL for a file
   */
  getFileUrl(file: { path: string }): string {
    if (env.Storage.provider === "aws") {
      return `${env.Storage.aws.CloudFrontDomain}/${file.path}`
    }

    return `${env.ServerUrl}/uploads/${file.path}`
  }
}
