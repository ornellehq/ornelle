import type { FastifyReply } from "fastify"
import { cookieConfig } from "~/config"
import env from "~/env"

export class AuthService {
  constructor(private fastify: FastifyWithSchemaProvider) {}

  async attachUserCookie({ email }: { email: string }, reply: FastifyReply) {
    const token = await this.fastify.services.user.signUser({ email })
    reply.clearCookie("ats_token", { path: "/" })

    const expiresNumber = env.UserExpires.match(/\d+/g)?.[0]
    const maxAge = expiresNumber ? Number.parseInt(expiresNumber) : 14

    if (Number.isNaN(maxAge))
      throw this.fastify.httpErrors.internalServerError("")

    reply.setCookie("ats_token", token, {
      ...cookieConfig,
      maxAge: maxAge * 60 * 60 * 24,
    })
  }
}
