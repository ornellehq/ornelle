import type { JSONSchemaType } from "env-schema"
import envschema from "env-schema"
import type { EmailProviderNames } from "lib/src/services/email/types"

export interface Env {
  PORT: number
  NODE_ENV: "development" | "production"
  UserSecret: string
  WorkspaceSecret: string
  UserExpires: string
  WorkspaceExpires: string
  KvStorageOptions: {
    driver: "redis"
    url: string
  }
  EmailServiceConfig: {
    providerName: EmailProviderNames
    providerConfig: Record<string, string>
    // domain: string;
    subdomain: string
  }
  DOMAIN: string
  ADMIN_URL: string
  OpenRouterKey: string // API key for OpenRouter
  GoogleApiKey: string
  Keys: {
    pages: string
  }
  Zoom: {
    clientSecret: string
    clientId: string
  }
  Google: {
    clientSecret: string
    clientId: string
  }
  PagesUrl: string
  ServerUrl: string
  Storage: {
    provider: "aws" | "local"
    aws: {
      CloudFrontPrivateKey: string
      CloudFrontDomain: string
      CloudFrontKeyPairId: string
      Bucket: string
      Region: string
      S3AccessKey: string
      S3SecretKey: string
    }
  }
}

const schema: JSONSchemaType<Env> = {
  type: "object",
  required: [
    "PORT",
    "EmailServiceConfig",
    "NODE_ENV",
    "WorkspaceSecret",
    "UserSecret",
    "OpenRouterKey",
    "GoogleApiKey",
    "Keys",
    "Google",
    "PagesUrl",
    "ServerUrl",
    "Storage",
  ],
  additionalProperties: true,
  properties: {
    PORT: {
      type: "number",
    },
    NODE_ENV: {
      type: "string",
    },
    UserSecret: {
      type: "string",
    },
    WorkspaceSecret: {
      type: "string",
    },
    UserExpires: {
      type: "string",
      default: "14d",
    },
    WorkspaceExpires: {
      type: "string",
      default: "7d",
    },
    KvStorageOptions: {
      type: "object",
      required: ["driver"],
      additionalProperties: true,
      // format: "x-string",
      "x-string": true,
      properties: {
        driver: {
          type: "string",
          enum: ["redis"],
        },
        url: {
          type: "string",
        },
      },
    },
    EmailServiceConfig: {
      type: "object",
      required: ["providerName", "providerConfig"],
      additionalProperties: false,
      "x-string": true,
      properties: {
        providerName: {
          type: "string",
          enum: ["sendgrid"],
        },
        providerConfig: {
          type: "object",
          required: [],
        },
        domain: {
          type: "string",
          default: "platform.co",
        },
        subdomain: {
          type: "string",
          default: "mail",
        },
      },
    },
    DOMAIN: {
      type: "string",
      default: "localhost",
    },
    ADMIN_URL: {
      type: "string",
    },
    OpenRouterKey: {
      type: "string",
    },
    GoogleApiKey: {
      type: "string",
    },
    Keys: {
      type: "object",
      required: ["pages"],
      additionalProperties: false,
      "x-string": true,
      properties: {
        pages: {
          type: "string",
        },
      },
    },
    Zoom: {
      type: "object",
      required: ["clientSecret", "clientId"],
      additionalProperties: false,
      "x-string": true,
      properties: {
        clientSecret: {
          type: "string",
        },
        clientId: {
          type: "string",
        },
      },
    },
    Google: {
      type: "object",
      required: ["clientSecret", "clientId"],
      additionalProperties: false,
      "x-string": true,
      properties: {
        clientSecret: {
          type: "string",
        },
        clientId: {
          type: "string",
        },
      },
    },
    PagesUrl: {
      type: "string",
    },
    ServerUrl: {
      type: "string",
    },
    Storage: {
      type: "object",
      required: ["provider"],
      additionalProperties: false,
      "x-string": true,
      properties: {
        provider: {
          type: "string",
          enum: ["aws", "local"],
        },
        aws: {
          type: "object",
          required: [
            "CloudFrontPrivateKey",
            "CloudFrontDomain",
            "CloudFrontKeyPairId",
          ],
          additionalProperties: false,
          "x-string": true,
          properties: {
            CloudFrontPrivateKey: {
              type: "string",
            },
            CloudFrontDomain: {
              type: "string",
            },
            CloudFrontKeyPairId: {
              type: "string",
            },
            Bucket: {
              type: "string",
            },
            Region: {
              type: "string",
            },
            S3AccessKey: {
              type: "string",
            },
            S3SecretKey: {
              type: "string",
            },
          },
        },
      },
    },
  },
}

const env = envschema({
  schema,
  dotenv: true,
  ajv: {
    customOptions: (ajv) => {
      ajv.opts.coerceTypes = true
      ajv.opts.strict = false
      ajv.opts.strictTypes = false
      ajv.opts.removeAdditional = true

      ajv.addKeyword({
        keyword: "x-string",
        type: "string",
        modifying: true,
        validate: (_, data, schema, context) => {
          if (!schema) return false
          if (typeof data !== "string") return ajv.validate(schema, data)

          try {
            const parsedData = JSON.parse(data)
            const res = ajv.validate(schema, parsedData)

            if (res && context) {
              context.parentData[context.parentDataProperty] = parsedData
            }
            return res
          } catch (e) {
            return false
          }
        },
      })

      return ajv
    },
  },
})

if (env.Storage.provider === "aws" && !env.Storage.aws) {
  throw new Error("AWS storage configuration is missing")
}

export default env
