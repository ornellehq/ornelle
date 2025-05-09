import type { RoleContract } from "isomorphic-blocs/src/types/contracts"

export class RoleService implements RoleContract {
  constructor(private fastify: FastifyWithSchemaProvider) {}

  createRole: RoleContract["createRole"] = async (data) => {
    const role = await this.fastify.prisma.role.create({
      data,
    })

    return role
  }

  updateRole: RoleContract["updateRole"] = async (where, data) => {
    const role = await this.fastify.prisma.role.update({
      where,
      data,
    })

    return role
  }

  deleteRole: RoleContract["deleteRole"] = async (where) => {
    const role = await this.fastify.prisma.role.delete({
      where,
    })

    return role
  }
}
