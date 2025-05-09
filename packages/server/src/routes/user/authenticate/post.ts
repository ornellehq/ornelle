export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["User"],
        operationId: "Request authentication",
        description: "Request authentication for an email address",
        querystring: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              description: "Email address wanting to log in",
              type: "string",
              format: "email",
              examples: ["email@email.com"],
            },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["status", "message"],
            properties: {
              status: {
                type: ["string", "number"],
              },
              message: {
                type: "string",
              },
            },
          },
        },
      },
    },
    async (request) => {
      return fastify.services.user.preAuthenticateUser({
        email: request.query.email.toLowerCase(),
        firstName: "",
      })
    },
  )
}
