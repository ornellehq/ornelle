export interface EmailOptions {
  to: string | string[] | { email: string; name?: string }[]
  body: string
  subject: string
  from: {
    email: string
    name?: string
  }
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: EmailAttachment[]
  replyTo?: string
  trackingId: string // For tracking email status
  headers?: Record<string, string>
  sendAt?: Date // Exact time to send the email
}

export interface EmailAttachment {
  filename: string
  content: string // | Buffer
  contentType: string
  disposition: "attachment" | "inline"
  contentId?: string // For inline images
}

export interface EmailProvider {
  name: EmailProviderNames
  sendEmail(options: EmailOptions): Promise<EmailSendResult>
  getEmailStatus?(trackingId: string): Promise<EmailStatus>
  parseInboundEmail?(payload: unknown): Promise<InboundEmail>
}

export interface EmailSendResult {
  success: boolean
  trackingId?: string // Provider-specific ID for tracking
  error?: Error
  scheduledAt?: string // Added for scheduled emails
}

export enum EmailStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  OPENED = "opened",
  CLICKED = "clicked",
  BOUNCED = "bounced",
  SPAM = "spam",
  BLOCKED = "blocked",
  FAILED = "failed",
  UNKNOWN = "unknown",
}

export interface InboundEmail {
  from: {
    email: string
    name?: string
  }
  to: {
    email: string
    name?: string
  }[]
  cc?: {
    email: string
    name?: string
  }[]
  bcc?: {
    email: string
    name?: string
  }[]
  subject: string
  body: {
    html?: string
    text?: string
  }
  attachments?: EmailAttachment[]
  headers?: Record<string, string>
  messageId: string // For threading
  receivedAt: Date
  inReplyTo?: string
}

export type EmailProviderNames = "sendgrid" // | "aws-ses" | "mailgun"
export type EmailProviderConfig = Record<string, string>

export interface EmailAddressGenerationOptions {
  userId: string
  workspaceId?: string
  domain: string
  subdomain?: string
}

export interface GeneratedEmailAddress {
  email: string
  userId: string
  workspaceId?: string
}
