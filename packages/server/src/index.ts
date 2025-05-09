import Fastify from "fastify"
import qs from "qs"
import { generateSDK } from "../scripts/generate-sdk"
import env from "./env"
import prepare from "./prepare"

export const app = Fastify({
  logger: {
    level: "info",
  },
  maxParamLength: 300,
  querystringParser: qs.parse,
})

prepare(app)

app.listen({ port: env.PORT, host: "0.0.0.0" }, async (err, address) => {
  if (err) return app.log.error(err, err?.message, { address })

  console.log(`App running on ${address}`)

  if (env.NODE_ENV === "development") {
    try {
      await generateSDK()
      app.log.info("SDK regenerated")
    } catch (err) {
      app.log.error("Failed to regenerate SDK:", err)
    }
  }
})
