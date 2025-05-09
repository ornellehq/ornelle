import path from "node:path"
import env from "./env"

export const cookieConfig = {
  domain: env.NODE_ENV === "development" ? "" : env.DOMAIN,
  path: "/",
  secure: env.NODE_ENV === "production", // send cookie over HTTPS only
  httpOnly: true,
  sameSite: false, // isDevelopment() ? "lax" : "none", // alternative CSRF protection
}

export const rootDir = path.dirname(require.main?.path ?? "")

export default {}
