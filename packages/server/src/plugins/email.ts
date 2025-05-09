import type { FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"
import EmailService from "lib/src/services/email/service"
import type { EmailProviderNames } from "lib/src/services/email/types"
import env from "~/env"

declare module "fastify" {
  interface FastifyInstance {
    email: EmailService
  }
}

export const emailClient = new EmailService(
  env.EmailServiceConfig.providerName,
  env.EmailServiceConfig.providerConfig,
  {
    domain: env.DOMAIN,
    subdomain: env.EmailServiceConfig.subdomain,
  },
)

export interface EmailServiceOptions {
  providerName: EmailProviderNames
  providerOptions: Record<string, string>
  domain: string
  subdomain: string
}

const email: FastifyPluginAsync<EmailServiceOptions> = async (fastify) => {
  fastify.decorate("email", emailClient)
}

const emailPlugin = fp(email, "4.x")

export default emailPlugin
