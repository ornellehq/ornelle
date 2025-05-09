declare global {
  namespace PrismaJson {
    type RTEContent = {
      html: string
      json: object
    }
    type FormResponses = {
      fields: unknown[]
    }
  }
}
