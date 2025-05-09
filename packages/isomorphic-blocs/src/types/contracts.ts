import type {
  Application,
  Candidate,
  EntityType,
  Opening,
  Permission,
  Prisma,
  Profile,
  Role,
  User,
  Workspace,
} from "@prisma/client"
import type { SelectQueryBuilder } from "kysely"
import type { DB } from "../kysely"
import type { Filter, SelectedFilter } from "./conditions"

export interface UserContract {
  createUser(data: Prisma.UserCreateInput): Promise<User>
  updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User>
  deleteUser(data: Prisma.UserWhereUniqueInput): Promise<User>
}

export interface ProfileContract {
  createProfile(data: Prisma.ProfileCreateInput): Promise<Profile>
  updateProfile(
    where: Prisma.ProfileWhereUniqueInput,
    data: Prisma.ProfileUpdateInput,
  ): Promise<Profile>
  deleteProfile(data: Prisma.ProfileWhereUniqueInput): Promise<Profile>
}

export interface WorkspaceContract {
  createWorkspace(data: Prisma.WorkspaceCreateInput): Promise<Workspace>
  updateWorkspace(
    where: Prisma.WorkspaceWhereUniqueInput,
    data: Prisma.WorkspaceUpdateInput,
  ): Promise<Workspace>
  deleteWorkspace(data: Prisma.WorkspaceWhereUniqueInput): Promise<Workspace>
}

export interface PermissionContract {
  createPermission(data: Prisma.PermissionCreateInput): Promise<Permission>
  updatePermission(
    where: Prisma.PermissionWhereUniqueInput,
    data: Prisma.PermissionUpdateInput,
  ): Promise<Permission>
  deletePermission(data: Prisma.PermissionWhereUniqueInput): Promise<Permission>
}

export interface RoleContract {
  createRole(data: Prisma.RoleCreateInput): Promise<Role>
  updateRole(
    where: Prisma.RoleWhereUniqueInput,
    data: Prisma.RoleUpdateInput,
  ): Promise<Role>
  deleteRole(data: Prisma.RoleWhereUniqueInput): Promise<Role>
}

export interface EntityContract {
  mergeAttributes: <T extends { id: string }>(
    entities: T[],
    entityType: EntityType,
  ) => Promise<T[]>
  findEntities: <T extends { id: string }>(args: {
    entityType: EntityType
    options: {
      filters: (Filter & SelectedFilter)[]
      sorts: { id: string; order: "desc" | "asc" }[]
    }
    qb: SelectQueryBuilder<
      DB & {
        e: Application | Candidate | Role | Opening
      },
      "e",
      T
    >
  }) => SelectQueryBuilder<
    DB & {
      e: Application | Candidate | Role | Opening
    },
    "e",
    T
  >
}
