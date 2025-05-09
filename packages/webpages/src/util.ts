import crypto from "node:crypto"
import { Configuration, ListingsApi } from "../../sdks/src/server-sdk/index.js"

export const prerender = false

const config = new Configuration({ basePath: import.meta.env.Mothership })
export const listingApi = new ListingsApi(config)
export const getOpening = async ({ url, id }: { url: string; id: string }) => {
  return listingApi.getOpening({ url, id })
}

export const safeJsonParse = (str: string, defaultValue: unknown) => {
  try {
    return JSON.parse(str)
  } catch (err) {}

  return defaultValue
}

/**
 * Create an HMAC signature for FormData
 * @param formData FormData to sign
 * @param timestamp Timestamp to include in the signature
 * @returns Promise resolving to the base64 HMAC signature
 */
export async function createHmacSignatureFromFormData(
  timestamp: number,
): Promise<string> {
  // Create payload with entries and timestamp
  const payload = JSON.stringify({
    timestamp,
  })

  // Create HMAC using SHA-256 algorithm with the key
  const hmac = crypto.createHmac("sha256", import.meta.env.KeyToMothership)
  hmac.update(payload)

  // Return the signature as base64
  return hmac.digest("base64")
}
