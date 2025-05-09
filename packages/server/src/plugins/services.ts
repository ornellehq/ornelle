import type { FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"
import { ApplicationService } from "~/blocs/application/service"
import { AuthService } from "~/blocs/auth/service"
import { EntityService } from "~/blocs/entity/service"
import { FileService } from "~/blocs/file/service"
import { ProfileService } from "~/blocs/profile/service"
import { RoleService } from "~/blocs/role/service"
import { WorkspaceService } from "~/blocs/workspace/service"
import { AwsService } from "../blocs/aws/service"
import { EmailService } from "../blocs/email/service"
import { UserService } from "../blocs/user/service"

declare module "fastify" {
  interface FastifyInstance {
    services: {
      user: InstanceType<typeof UserService>
      workspace: InstanceType<typeof WorkspaceService>
      profile: InstanceType<typeof ProfileService>
      role: InstanceType<typeof RoleService>
      entity: InstanceType<typeof EntityService>
      file: InstanceType<typeof FileService>
      email: InstanceType<typeof EmailService>
      auth: InstanceType<typeof AuthService>
      application: InstanceType<typeof ApplicationService>
      aws: InstanceType<typeof AwsService>
    }
  }
}

const services: FastifyPluginAsync<object> = async (fastify) => {
  fastify.decorate("services", {
    user: new UserService(fastify),
    workspace: new WorkspaceService(fastify),
    profile: new ProfileService(fastify),
    role: new RoleService(fastify),
    entity: new EntityService(fastify),
    file: new FileService(fastify),
    email: new EmailService(fastify),
    auth: new AuthService(fastify),
    application: new ApplicationService(fastify),
    aws: new AwsService(fastify),
  })
}

const servicePlugin = fp(services, {
  fastify: "4.x",
  name: "services",
})

export default servicePlugin
