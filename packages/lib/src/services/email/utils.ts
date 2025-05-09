/**
 * Generate a unique email address for a user
 * @param idBase
 * @param domain Base domain for the email
 * @param subdomain Optional subdomain (default: 'mail')
 * @returns The generated email address
 */
export function generateEmailAddress(
  idBase: string,
  domain: string,
  subdomain: string,
): string {
  // const uniqueId = crypto
  //   .createHash("sha256")
  //   .update(idBase)
  //   .digest("hex")
  //   .substring(0, 8)

  return `${idBase}@${subdomain}.${domain}`
}

/**
 * Validate if an email is a system-generated email address
 * @param email The email address to validate
 * @param domain The domain to check against
 * @returns Whether the email is a system-generated address
 */
export function isSystemGeneratedEmail(email: string, domain: string): boolean {
  // Check if the email matches our pattern for system-generated emails
  const regex = new RegExp(
    `^[a-f0-9]{8}@[a-z]+\\.${domain.replace(".", "\\.")}$`,
  )
  return regex.test(email)
}

/**
 * Extract the thread ID from an email subject
 * @param subject Email subject
 * @returns The thread ID if found, undefined otherwise
 */
export function extractThreadId(subject: string): string | undefined {
  const match = subject.match(/\[Thread:([a-zA-Z0-9]+)\]/)
  return match ? match[1] : undefined
}

/**
 * Add a thread ID to an email subject
 * @param subject Original subject
 * @param threadId Thread ID to add
 * @returns Updated subject with thread ID
 */
export function addThreadId(subject: string, threadId: string): string {
  // Check if subject already has a thread ID
  if (extractThreadId(subject)) {
    return subject
  }
  return `${subject} [Thread:${threadId}]`
}

/**
 * Clean an email subject by removing prefixes like Re:, Fwd:, etc.
 * @param subject Email subject
 * @returns Cleaned subject
 */
export function cleanSubject(subject: string): string {
  // Remove common prefixes like Re:, Fwd:, etc.
  return subject.replace(/^(Re|Fwd|Fw|FWD|FW):\s*/i, "").trim()
}

/**
 * Add a prefix to an email subject (e.g., "Re: ")
 * @param subject Original subject
 * @param prefix Prefix to add (default: "Re: ")
 * @returns Updated subject with prefix
 */
export function addSubjectPrefix(subject: string, prefix = "Re: "): string {
  const cleanedSubject = cleanSubject(subject)
  return `${prefix}${cleanedSubject}`
}
