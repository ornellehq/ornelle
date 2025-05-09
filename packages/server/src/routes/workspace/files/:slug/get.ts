export default async (fastify: FastifyWithSchemaProvider) => {
  fastify.get(
    "/",
    {
      preValidation: [
        // fastify.authenticate.forUser,
        // fastify.authenticate.forWorkspace,
      ],
      schema: {
        tags: ["File"],
        operationId: "Get file",
        description: "",
        params: {
          type: "object",
          required: ["slug"],
          properties: {
            slug: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      // const { id: workspaceId } = request.workspace
      const { slug } = request.params

      const file = await fastify.prisma.file.findUnique({
        where: {
          slug,
          // workspaceId,
        },
      })

      if (!file) {
        return
      }

      const storagePath = `${file.path}/original.${file.name.split(".").slice(-1)[0]}`
      // reply.sendFile(`${file.path}/${file.name}`)
      return reply.sendFile(storagePath)
    },
  )
}
