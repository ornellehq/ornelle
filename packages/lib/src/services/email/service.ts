// File: /packages/lib/src/services/email/service.ts

import EmailReplyParser from "email-reply-parser"
import { convert } from "html-to-text"
import sanitizeHtml from "sanitize-html"
import { createEmailProvider } from "./provider-factory"
import {
  type EmailAddressGenerationOptions,
  type EmailOptions,
  type EmailProvider,
  type EmailProviderNames,
  type EmailSendResult,
  EmailStatus,
  type GeneratedEmailAddress,
  type InboundEmail,
} from "./types"
import { generateEmailAddress, isSystemGeneratedEmail } from "./utils.js"

class EmailService {
  private provider: EmailProvider
  // @ts-ignore
  private config: Record<string, string>
  private defaultDomain: string
  private defaultSubdomain = "mail"

  constructor(
    provider: EmailProviderNames,
    config: Record<string, string>,
    options: { domain: string; subdomain: string },
  ) {
    this.provider = createEmailProvider(provider, config)
    this.config = config
    this.defaultDomain = options.domain
    this.defaultSubdomain = options.subdomain
  }

  get providerName() {
    return this.provider.name
  }

  /**
   * Send an email
   * @param options Email options
   * @returns Result of the send operation
   */
  async sendEmail(options: EmailOptions): Promise<EmailSendResult> {
    try {
      return await this.provider.sendEmail(options)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    }
  }

  /**
   * Get the status of a sent email
   * @param trackingId The tracking ID returned when the email was sent
   * @returns The current status of the email
   */
  async getEmailStatus(trackingId: string): Promise<EmailStatus> {
    if (this.provider.getEmailStatus) {
      return await this.provider.getEmailStatus(trackingId)
    }
    return EmailStatus.UNKNOWN
  }

  /**
   * Parse an inbound email from webhook payload
   * @param payload The webhook payload from the email provider
   * @returns Parsed inbound email
   */
  async parseInboundEmail(payload: unknown): Promise<InboundEmail | null> {
    if (this.provider.parseInboundEmail) {
      return await this.provider.parseInboundEmail(payload)
    }
    return null
  }

  /**
   * Generate a unique email address for a user
   * @param options Options for generating the email address
   * @returns The generated email address
   */
  generateUserEmailAddress(
    options: EmailAddressGenerationOptions,
  ): GeneratedEmailAddress {
    const { userId, workspaceId, domain, subdomain = "mail" } = options

    const email = generateEmailAddress(userId, domain, subdomain)

    // Create the result object with required properties
    const result: GeneratedEmailAddress = {
      email,
      userId,
    }

    // Only add workspaceId if it's defined
    if (workspaceId !== undefined) {
      result.workspaceId = workspaceId
    }

    return result
  }

  /**
   * Validate if an email is a system-generated email address
   * @param email The email address to validate
   * @param domain The domain to check against
   * @returns Whether the email is a system-generated address
   */
  isSystemEmail(email: string, domain: string): boolean {
    return isSystemGeneratedEmail(email, domain)
  }

  /**
   * Generate a unique email address for a user in a workspace
   * Uses the default domain and subdomain
   *
   * @param userName The user name
   * @param attempts Number of attempts to generate a unique address (for collision handling)
   * @returns The generated email address
   */
  generateWorkspaceUserEmailAddress(userName: string, attempts = 0): string {
    // If we've tried more than 3 times, add an extra random component
    const modifiedUserName =
      attempts > 3
        ? `${userName}-${Math.floor(Math.random() * 1000)}`
        : userName

    return generateEmailAddress(
      modifiedUserName,
      this.defaultDomain,
      this.defaultSubdomain,
    )
  }

  /**
   * Check if an email address would be valid for our system
   * @param email The email address to validate
   * @returns Whether the email is valid
   */
  validateSystemEmailAddress(email: string): boolean {
    return isSystemGeneratedEmail(email, this.defaultDomain)
  }

  /**
   * Sanitizes HTML content from emails and optionally removes quoted replies
   * @param htmlContent The HTML content to sanitize
   * @param options Configuration options for processing
   * @param options.sanitize Whether to sanitize the HTML (remove scripts, event handlers, etc.)
   * @param options.removeQuotedReplies Whether to remove quoted replies from the email
   * @returns The processed HTML content
   */
  processEmailContent(
    htmlContent: string,
    options: {
      sanitize?: boolean
      removeQuotedReplies?: boolean
    } = {},
  ): string {
    let processedContent = htmlContent

    // Sanitize HTML if requested
    if (options.sanitize) {
      const SAFE_HTML_ELEMENTS = [
        // Text formatting
        "a",
        "abbr",
        "b",
        "strong",
        "i",
        "em",
        "u",
        "br",
        "code",
        "pre",
        "blockquote",
        "q",
        "small",
        "sub",
        "sup",
        "span",
        "mark",

        // Headings
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",

        // Paragraphs and structure
        "p",
        "div",
        "section",
        "article",
        "hr",

        // Lists
        "ul",
        "ol",
        "li",
        "dl",
        "dt",
        "dd",

        // Tables
        "table",
        "thead",
        "tbody",
        "tfoot",
        "tr",
        "td",
        "th",

        // Images
        "img",
      ]

      try {
        processedContent = sanitizeHtml(processedContent, {
          allowedTags:
            sanitizeHtml.defaults.allowedTags.concat(SAFE_HTML_ELEMENTS),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            "*": ["class", "style", "id"],
            img: ["src", "alt", "width", "height", "style"],
            a: ["href", "target", "rel"],
            td: ["colspan", "rowspan", "align", "valign", "width", "height"],
            th: ["colspan", "rowspan", "align", "valign", "width", "height"],
            tr: ["align", "valign"],
            table: ["width", "height", "align"],
          },
          // Ensure URLs in src, href etc are safe
          allowedSchemes: ["http", "https", "mailto", "tel"],
          // Remove all JavaScript event handlers (onclick, onload, etc)
          allowedSchemesByTag: {},
          disallowedTagsMode: "discard",
        })
      } catch (error) {
        console.warn("Failed to sanitize HTML content:", error)
        // Fall back to a more aggressive sanitization if the custom one fails
        processedContent = sanitizeHtml(processedContent)
      }
    }

    if (options.removeQuotedReplies) {
      // Remove quoted replies if requested
      try {
        const parser = new EmailReplyParser()
        const email = parser.read(convert(processedContent))
        const visibleText = email.getVisibleText()
        processedContent = visibleText
      } catch (error) {
        console.warn("Failed to remove quoted replies:", error)
        // Continue with the original content if quote removal fails
      }
    }

    return processedContent
  }
}

export default EmailService
