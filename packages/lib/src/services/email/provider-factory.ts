import Sendgrid from "./providers/sendgrid"
import type {
  EmailProvider,
  EmailProviderConfig,
  EmailProviderNames,
} from "./types"

type ProviderConstructor = new (config: EmailProviderConfig) => EmailProvider

const providerMap: Record<EmailProviderNames, ProviderConstructor> = {
  sendgrid: Sendgrid,
}

export const createEmailProvider = (
  name: EmailProviderNames,
  config: EmailProviderConfig,
): EmailProvider => {
  const Provider = providerMap[name]

  if (!Provider) throw new Error(`Unsupported email provider: ${name}`)

  return new Provider(config)
}
