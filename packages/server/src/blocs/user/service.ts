import type { HttpError } from "@fastify/sensible"
import { render } from "@react-email/render"
import type { Prisma, User } from "isomorphic-blocs/src/prisma"
import type { UserContract } from "isomorphic-blocs/src/types/contracts"
import { sign } from "jsonwebtoken"
import { generateSecureRandomWordWithHyphens } from "lib/src/utils/secure-random-word"
import env from "~/env"
import LogInCode from "~/shared/jsx/emails/login-code"
import type { AuthUser } from "~/types"

const cantLoginMessage =
  "We can't log you in right now. Please try again shortly"

export class UserService implements UserContract {
  private loginCodePrefix = "auth_code"
  private loginCodeIdentifier = (email: string) =>
    `${this.loginCodePrefix}:${email}`
  constructor(private fastify: FastifyWithSchemaProvider) {}

  async findUser(where: Prisma.UserWhereUniqueInput) {
    const user = await this.fastify.prisma.user.findUnique({
      where,
    })

    return user
  }

  createUser: UserContract["createUser"] = async (
    data: Prisma.UserCreateInput,
  ) => {
    const user = await this.fastify.prisma.user.create({
      data,
    })
    return user
  }

  updateUser: UserContract["updateUser"] = async (where, data) => {
    const user = await this.fastify.prisma.user.update({ where, data })
    return user
  }

  deleteUser: UserContract["deleteUser"] = async (
    where: Prisma.UserWhereUniqueInput,
  ) => {
    const deletedUser = await this.fastify.prisma.user.delete({ where })
    return deletedUser
  }

  preAuthenticateUser = async ({
    email,
    firstName = "",
  }: { email: string; firstName?: string }) => {
    const fastify = this.fastify
    const code = generateSecureRandomWordWithHyphens(3)

    const [err] = await fastify.to(
      fastify.kvStorage.setItem(this.loginCodeIdentifier(email), code, {
        ttl: 10 * 60,
      }),
    )

    if (err) {
      fastify.log.error(err, err.message, { email })
      fastify.kvStorage.removeItem(this.loginCodeIdentifier(email))
      return fastify.httpErrors.serviceUnavailable(cantLoginMessage)
    }

    if (env.NODE_ENV !== "development") {
      const [emailErr, emailRes] = await fastify.to(
        fastify.email.sendEmail({
          to: email,
          from: { email: "hello@ornelle.co", name: "Ornelle" },
          subject: `Your Ornelle login code: ${code}`,
          body: await render(
            LogInCode({ code, firstName, companyName: "Ornelle" }),
          ),
          trackingId: "",
        }),
      )

      if (emailErr) {
        fastify.log.error(emailErr, emailErr.message, {
          email,
          provider: fastify.email.providerName,
        })
        return fastify.httpErrors.serviceUnavailable(cantLoginMessage)
      }

      if (!emailRes) {
        fastify.log.error(new Error("Email send failed without an error"), "", {
          email,
          provider: fastify.email.providerName,
        })
        return fastify.httpErrors.serviceUnavailable(cantLoginMessage)
      }
    } else {
      console.log({ code })
    }

    return {
      status: "Ok",
      message: `Authentication code sent to ${email}`,
    }
  }

  authenticateUser = async ({
    email,
    code,
  }: {
    email: string
    code: string
  }): Promise<HttpError | { user: User | null; meta: { email: string } }> => {
    const fastify = this.fastify
    const identifier = this.loginCodeIdentifier(email)
    const [kvErr, savedCode] = await fastify.to(
      fastify.kvStorage.getItem(identifier),
    )

    if (kvErr) {
      fastify.log.error(kvErr, kvErr.message, { email })
      return fastify.httpErrors.internalServerError(cantLoginMessage)
    }

    if (savedCode !== code) {
      return fastify.httpErrors.badRequest("Wrong or expired log in code")
    }

    await fastify.kvStorage.removeItem(identifier)

    const user = await this.findUser({ email })

    return {
      user,
      meta: {
        email,
      },
    }
  }

  signUser = async (user: AuthUser) => {
    // @ts-ignore
    return sign(user, env.UserSecret, { expiresIn: env.UserExpires })
  }
}
