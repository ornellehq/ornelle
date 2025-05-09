import type { Prisma } from "isomorphic-blocs/src/prisma"
import type { WorkspaceContract } from "isomorphic-blocs/src/types/contracts"
import { sign } from "jsonwebtoken"
import env from "~/env"
import type { AuthWorkspace } from "~/types"

export class WorkspaceService implements WorkspaceContract {
  constructor(private fastify: FastifyWithSchemaProvider) {}

  createWorkspace: WorkspaceContract["createWorkspace"] = async (data) => {
    const workspace = await this.fastify.prisma.workspace.create({
      data,
    })

    return workspace
  }

  updateWorkspace: WorkspaceContract["updateWorkspace"] = async (
    where,
    data,
  ) => {
    const workspace = await this.fastify.prisma.workspace.update({
      where,
      data,
    })

    return workspace
  }

  deleteWorkspace: WorkspaceContract["deleteWorkspace"] = async (where) => {
    const workspace = await this.fastify.prisma.workspace.delete({
      where,
    })

    return workspace
  }

  findWorkspace = async (where: Prisma.WorkspaceWhereUniqueInput) => {
    return this.fastify.prisma.workspace.findUnique({ where })
  }

  findWorkspaces = async (where: Prisma.WorkspaceWhereInput) => {
    return this.fastify.prisma.workspace.findMany({ where })
  }

  signWorkspace = async (data: AuthWorkspace) => {
    // @ts-ignore
    return sign(data, env.WorkspaceSecret, { expiresIn: env.WorkspaceExpires })
  }
}
