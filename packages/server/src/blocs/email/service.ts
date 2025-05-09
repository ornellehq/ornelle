import { init } from "@paralleldrive/cuid2"

export class EmailService {
  constructor(private fastify: FastifyWithSchemaProvider) {}

  async generateEmailAddress({
    profileId,
    workspaceId,
  }: { profileId: string; workspaceId: string }) {
    const existingEmailAddress =
      await this.fastify.prisma.emailAddress.findFirst({
        where: { profileId, workspaceId, isActive: true, deletedAt: null },
      })

    if (existingEmailAddress) {
      return existingEmailAddress
    }
    // Set all existing email addresses to inactive
    await this.fastify.prisma.emailAddress.updateMany({
      where: { profileId, workspaceId },
      data: { isActive: false },
    })

    // Generate a unique email address for the profile
    let attempts = 0
    let emailAddress = null

    while (!emailAddress && attempts < 5) {
      const cuid = init({ length: 12 })()
      const generatedEmail =
        this.fastify.email.generateWorkspaceUserEmailAddress(cuid)

      try {
        emailAddress = await this.fastify.prisma.emailAddress.create({
          data: {
            profileId,
            isActive: true,
            email: generatedEmail,
            workspaceId,
          },
        })
      } catch (e) {
        if (
          e instanceof Error &&
          e.message.includes("Unique constraint failed")
        ) {
          this.fastify.log.warn(`Error creating email address: ${e.message}`)
          attempts++
        } else {
          this.fastify.log.error(`Error creating email address: ${String(e)}`)
          attempts = 5
        }
      }
    }

    if (!emailAddress) {
      throw new Error("Failed to create email address after multiple attempts")
    }

    return emailAddress
  }
}
