import {
  type CloudfrontSignedCookiesOutput,
  getSignedCookies,
} from "@aws-sdk/cloudfront-signer"
import type { FastifyReply } from "fastify"
import env from "~/env"

export interface CloudFrontSignOptions {
  /**
   * Resource paths to sign (supports multiple paths)
   * Each path should start with '/' and be relative to the CloudFront distribution
   */
  resourcePaths: string[]

  /**
   * Time when the signed cookies should expire (in milliseconds since epoch)
   * Default: 24 hours from now
   */
  expiresAt?: number
}

export interface SignedCookies {
  /**
   * CloudFront signed cookies object
   * Contains 'CloudFront-Key-Pair-Id', 'CloudFront-Policy', and 'CloudFront-Signature'
   */
  cookies: CloudfrontSignedCookiesOutput

  /**
   * Cookie options for setting secure cookies
   */
  options: {
    path: string
    domain: string
    secure: boolean
    httpOnly: boolean
    sameSite: "strict" | "lax" | "none"
    maxAge: number
  }
}

export class AwsService {
  constructor(private fastify: FastifyWithSchemaProvider) {}

  /**
   * Generate signed cookies for CloudFront resources
   *
   * @param options - Options for signing CloudFront cookies
   * @returns Object containing cookies and cookie options
   */
  generateSignedCookies(options: CloudFrontSignOptions): SignedCookies {
    const {
      resourcePaths,
      expiresAt = Date.now() + 24 * 60 * 60 * 1000, // Default: 24 hours from now
    } = options

    // Extract CloudFront credentials from environment
    const {
      CloudFrontPrivateKey: _privateKey,
      CloudFrontKeyPairId: keyPairId,
      CloudFrontDomain: cloudFrontDomain,
    } = env.Storage.aws
    const privateKey = Buffer.from(_privateKey, "base64").toString("ascii")

    // Generate policy for multiple resources
    const resources = resourcePaths.map((path) => {
      // Ensure path starts with '/'
      const normalizedPath = path.startsWith("/") ? path : `/${path}`
      return `${cloudFrontDomain}${normalizedPath}`
    })

    // Get signed cookies for all resources
    const cookies = getSignedCookies({
      policy: JSON.stringify({
        Statement: [
          {
            Resource: resources[0],
            Condition: { DateLessThan: { "AWS:EpochTime": expiresAt } },
          },
        ],
      }),
      keyPairId,
      privateKey,
      // dateLessThan: new Date(expiresAt).toISOString(),
    })

    // Calculate cookie max age in seconds
    const maxAge = Math.floor((expiresAt - Date.now()) / 1000)

    return {
      cookies,
      options: {
        path: "/",
        domain: env.DOMAIN,
        secure: true,
        httpOnly: true,
        sameSite: "strict",
        maxAge,
      },
    }
  }

  /**
   * Generate signed cookies for a single CloudFront resource
   *
   * @param resourcePath - Single resource path to sign
   * @param expiresAt - Time when the signed cookies should expire
   * @returns Object containing cookies and cookie options
   */
  generateSignedCookieForPath(
    resourcePath: string,
    expiresAt?: number,
  ): SignedCookies {
    return this.generateSignedCookies({
      resourcePaths: [resourcePath],
      ...(expiresAt ? { expiresAt } : {}),
    })
  }

  /**
   * Set signed cookies in a Fastify reply for accessing CloudFront resources
   *
   * @param reply - Fastify reply object
   * @param options - Options for signing CloudFront cookies
   */
  setSignedCookiesInReply(
    reply: FastifyReply,
    options: CloudFrontSignOptions,
  ): void {
    const { cookies, options: cookieOptions } =
      this.generateSignedCookies(options)

    // Set each CloudFront cookie in the reply
    for (const [name, value] of Object.entries(cookies)) {
      reply.setCookie(name, value, cookieOptions)
    }
  }

  /**
   * Clear CloudFront signed cookies from a Fastify reply
   *
   * @param reply - Fastify reply object
   */
  clearSignedCookies(reply: FastifyReply): void {
    const domain = new URL(env.Storage.aws.CloudFrontDomain).hostname

    // Clear all CloudFront cookies
    const cookieNames = [
      "CloudFront-Key-Pair-Id",
      "CloudFront-Policy",
      "CloudFront-Signature",
    ]

    for (const name of cookieNames) {
      reply.clearCookie(name, {
        path: "/",
        domain,
      })
    }
  }
}
