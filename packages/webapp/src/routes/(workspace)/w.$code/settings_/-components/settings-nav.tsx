import { Link, type ToOptions } from "@tanstack/react-router"
import type { FunctionComponent } from "react"
import CaretRight from "webui-library/src/icons/CaretRight"
import Layers from "webui-library/src/icons/Layers"
import User from "webui-library/src/icons/User"
import Settings05 from "webui-library/src/icons/settings-05"
import { useWorkspaceParams } from "~/core/workspace/navigation"
import { useWorkspace } from "~/core/workspace/workspace.context"

interface ILink {
  id: string
  name: string
  path: ToOptions
  Icon: FunctionComponent<React.SVGProps<SVGSVGElement>>
}
interface LinkGroup {
  id: string
  name: string
  links: ILink[]
}

const SettingsNav = () => {
  const { name } = useWorkspace()
  const { code } = useWorkspaceParams()
  const linkGroups: LinkGroup[] = [
    {
      id: "account",
      name: "Account",
      links: [
        {
          id: "profile",
          name: "Profile",
          Icon: User,
          path: {
            to: "/w/$code/settings/profile",
            params: {
              code,
            },
          },
        },
        // {
        //   id: "notifications",
        //   name: "Notifications",
        //   Icon: Notification03,
        //   path: {
        //     to: "/w/$code/settings/workspace",
        //     params: {
        //       code,
        //     },
        //   },
        // },
      ],
    },
    {
      id: "administration",
      name: "Administration",
      links: [
        {
          id: "workspace",
          name: "Workspace",
          Icon: Settings05,
          path: {
            to: "/w/$code/settings/workspace",
            params: {
              code,
            },
          },
        },
      ],
    },
    {
      id: "features",
      name: "Features",
      links: [
        {
          id: "application-statuses",
          name: "Statuses",
          Icon: Layers,
          path: {
            to: "/w/$code/settings/application-statuses",
            params: {
              code,
            },
          },
        },
        {
          id: "job-board",
          name: "Job board",
          Icon: User,
          path: {
            to: "/w/$code/settings/job-board",
            params: {
              code,
            },
          },
        },
        // {
        //   id: "notifications",
        //   name: "Notifications",
        //   Icon: Notification03,
        //   path: {
        //     to: "/w/$code/settings/workspace",
        //     params: {
        //       code,
        //     },
        //   },
        // },
      ],
    },
  ]

  return (
    <aside className="h-full w-[240px] px-6 py-6">
      <Link
        to="/w/$code"
        params={{ code }}
        className="-ml-1 flex items-center gap-x-1 text-[13px] text-gray-500"
      >
        <span>
          <CaretRight className=" -scale-x-100 transform" />
        </span>
        <span>Back to {name}</span>
      </Link>
      <div className="py-4">
        {linkGroups.map(({ id, name, links }) => {
          return (
            <div key={id} className="py-4">
              <div className="mb-2">{name}</div>
              <ul className="flex flex-col gap-y-2">
                {links.map(({ id, name, Icon, path }) => {
                  return (
                    <li key={id} className="">
                      <Link {...path} className="flex items-center gap-x-2">
                        <span>
                          <Icon />
                        </span>
                        <span>{name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default SettingsNav
