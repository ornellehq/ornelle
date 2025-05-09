import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts"
import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify"

declare global {
  type FastifyWithSchemaProvider = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    FastifyBaseLogger,
    JsonSchemaToTsProvider
  >
}

export interface AuthUser {
  email: string
}

export interface AuthWorkspace {
  id: string
  profileId: string
}
