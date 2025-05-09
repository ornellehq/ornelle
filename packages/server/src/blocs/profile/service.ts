import type { ProfileContract } from "isomorphic-blocs/src/types/contracts"

export class ProfileService implements ProfileContract {
  constructor(private fastify: FastifyWithSchemaProvider) {}

  createProfile: ProfileContract["createProfile"] = async (data) => {
    const profile = await this.fastify.prisma.profile.create({
      data,
    })

    return profile
  }

  updateProfile: ProfileContract["updateProfile"] = async (where, data) => {
    const profile = await this.fastify.prisma.profile.update({
      where,
      data,
    })

    return profile
  }

  deleteProfile: ProfileContract["deleteProfile"] = async (where) => {
    const profile = await this.fastify.prisma.profile.delete({
      where,
    })

    return profile
  }
}
