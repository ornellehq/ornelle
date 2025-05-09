import sgMail from "@sendgrid/mail"
import { simpleParser } from "mailparser"
import {
  type EmailOptions,
  type EmailProvider,
  type EmailProviderConfig,
  type EmailProviderNames,
  type EmailSendResult,
  EmailStatus,
  type InboundEmail,
} from "../types"

// @ts-ignore
// Define a type for the SendGrid inbound email payload
interface SendGridInboundEmailPayload {
  from: string
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  html?: string
  text?: string
  headers: Record<string, string>
  attachments?: Array<{
    filename?: string
    content: string
    type?: string
    contentType?: string
  }>
}

class Sendgrid implements EmailProvider {
  name: EmailProviderNames

  constructor(config: EmailProviderConfig) {
    this.name = "sendgrid"
    if ("apikey" in config) sgMail.setApiKey(config.apikey)
  }

  async sendEmail(options: EmailOptions): Promise<EmailSendResult> {
    try {
      // Calculate sendAt time if delay is provided
      let sendAtTimestamp: number | undefined

      if (options.sendAt) {
        // Use the exact sendAt time
        sendAtTimestamp = Math.floor(options.sendAt.getTime() / 1000)
      }

      const response = await sgMail.send({
        to: options.to,
        from: options.from,
        subject: options.subject,
        html: options.body,
        ...(options.cc
          ? {
              cc: Array.isArray(options.cc)
                ? options.cc.map((value) => ({ email: value }))
                : [{ email: options.cc }],
            }
          : {}),
        ...(options.bcc
          ? {
              bcc: Array.isArray(options.bcc)
                ? options.bcc.map((value) => ({ email: value }))
                : [{ email: options.bcc }],
            }
          : {}),
        ...(options.replyTo ? { replyTo: { email: options.replyTo } } : {}),
        attachments:
          options.attachments?.map((attachment) => ({
            filename: attachment.filename,
            content: attachment.content,
            type: attachment.contentType,
            disposition: attachment.disposition,
            content_id: attachment.contentId,
          })) ?? [],
        headers: {
          "Message-ID": options.trackingId,
          ...(options.headers ?? {}),
        },
        // Add sendAt property for scheduled emails if applicable
        ...(sendAtTimestamp ? { sendAt: sendAtTimestamp } : {}),
      })
      const messageId = response[0]?.headers["x-message-id"]

      return {
        success: true,
        trackingId: messageId,
        ...(sendAtTimestamp
          ? { scheduledAt: new Date(sendAtTimestamp * 1000).toISOString() }
          : {}),
      }
    } catch (error) {
      console.error("Error sending email with SendGrid:", error)
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    }
  }

  // @ts-ignore
  async getEmailStatus(trackingId: string): Promise<EmailStatus> {
    try {
      // TODO: call to their Event Webhook or Email Activity API
      return EmailStatus.SENT
    } catch (error) {
      console.error("Error getting email status from SendGrid:", error)
      return EmailStatus.UNKNOWN
    }
  }

  async parseInboundEmail(payload: unknown): Promise<InboundEmail> {
    try {
      // SendGrid inbound parse webhook format
      // https://docs.sendgrid.com/for-developers/parsing-email/setting-up-the-inbound-parse-webhook
      const parsedPayload = await simpleParser(
        (payload as { email: string }).email,
      )

      // const parsedPayload = payload as SendGridInboundEmailPayload
      const { subject, html, text, headerLines, messageId, date, inReplyTo } =
        parsedPayload
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const from = parsedPayload.from?.value[0]!
      const to = Array.isArray(parsedPayload.to)
        ? parsedPayload.to
        : [parsedPayload.to]
      // const cc = Array.isArray(parsedPayload.cc)
      //   ? parsedPayload.cc
      //   : parsedPayload.cc
      //     ? [parsedPayload.cc]
      //     : []
      // const bcc = Array.isArray(parsedPayload.bcc)
      //   ? parsedPayload.bcc
      //   : parsedPayload.bcc
      //     ? [parsedPayload.bcc]
      // : []

      // Parse the received date from headers
      // const receivedHeader =
      //   headers.Date || headers.date || new Date().toISOString()
      // const receivedAt = new Date(receivedHeader)

      // Parse the original message ID for threading
      // const messageIdHeader =
      //   headers["Message-ID"] || headers["message-id"] || ""
      // const originalMessageId = messageIdHeader.replace(/[<>]/g, "").trim()

      // Parse attachments
      // const parsedAttachments: EmailAttachment[] = attachments.map((att) => ({
      //   filename: att.filename || "attachment",
      //   content: att.content,
      //   contentType: att.type || att.contentType || "application/octet-stream",
      //   disposition: "attachment",
      // }))

      return {
        from: {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          email: from.address!,
          name: from.name,
        },
        to: to.flatMap(
          (to) =>
            to?.value.map((to) => ({
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              email: to!.address!,
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              name: to!.name,
            })) ?? [],
        ),
        subject: subject ?? "",
        body: {
          ...(html ? { html } : {}),
          ...(text ? { text } : {}),
        },
        headers: headerLines.reduce(
          (acc, { line }) => {
            const [key, value] = line.split(": ")

            if (!key || !value) return acc

            acc[key.trim()] = value.trim()
            return acc
          },
          {} as Record<string, string>,
        ),
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        messageId: messageId!,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        receivedAt: new Date(date!),
        ...(inReplyTo ? { inReplyTo } : {}),
      }
    } catch (error) {
      console.error("Error parsing inbound email from SendGrid:", error)
      throw error
    }
  }
}

export default Sendgrid
