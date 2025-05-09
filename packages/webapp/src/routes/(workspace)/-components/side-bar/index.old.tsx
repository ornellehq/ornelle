import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useRouter } from "@tanstack/react-router"
import { type ReactElement, useId, useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { GetViews200ResponseInnerEntityTypeEnum } from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import { Form } from "webui-library/src/form"
import CaretRight from "webui-library/src/icons/CaretRight"
import ThreeDotsHorizontal from "webui-library/src/icons/ThreeDotsHorizontal"
import Search from "webui-library/src/icons/search"
import AddSquareBold from "webui-library/src/icons/solar/add-square-bold"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { cn } from "webui-library/src/utils/cn"
import Menu from "webui-library/src/widgets/menu"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import type { DrawerConfig } from "~/core/workspace/drawer/util"
import {
  useWorkspace,
  useWorkspaceContext,
} from "~/core/workspace/workspace.context"
import {
  applicationIcon,
  candidateIcon,
  formIcon,
  inboxIcon,
  openingIcon,
  processIcon,
  roleIcon,
} from "./icons"
import WorkspaceMenu from "./workspace-menu"

interface TMenu {
  id: string
  title: string
  link: string
  icon?: ReactElement
  menu?: TMenu[]
  isView?: boolean
  drw?: DrawerConfig
}
interface TMenuGroup {
  id: string
  title?: string
  collapsible?: boolean
  link?: string
  menu?: TMenu[]
  icon?: ReactElement
}

const titleClassName =
  "flex-1 overflow-hidden py-1 flex items-center rounded-lg gap-x-1.5 group text-[#374151]"

const RenameForm = ({
  name,
  onSubmit: _onSubmit,
}: { name: string; onSubmit: SubmitHandler<{ name: string }> }) => {
  const { control, handleSubmit } = useForm<{ name: string }>({
    defaultValues: { name },
  })
  const onSubmit = handleSubmit(_onSubmit)
  return (
    <Form onSubmit={onSubmit} className="-ml-1 relative z-50">
      <Controller
        control={control}
        name="name"
        render={({ field }) => {
          return (
            <TextFieldInput
              autoFocus
              variant="plain"
              value={field.value}
              onChange={field.onChange}
              className="h-5 rounded-md border border-gray-100 bg-transparent px-1 leading-5"
            />
          )
        }}
      />
    </Form>
  )
}

const MenuItem = ({
  menu: { id, title, link, icon, menu, isView, drw },
  depth,
}: { menu: TMenu; depth: number }) => {
  const api = useWorkspaceApi()
  const { setAppState } = useWorkspaceContext()
  const [actionsOpened, setActionsOpened] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const router = useRouter()
  const [expanded, setExpanded] = useState(true)
  const marginLeft = `${depth * 20 - (icon ? 8 : 0)}px`

  return (
    <div
      key={id}
      style={{
        marginLeft,
      }}
    >
      <div className="group flex items-center rounded-lg px-2 transition-all duration-75 hover:bg-white">
        <Link to={link} className={titleClassName}>
          {icon || menu ? (
            <span className={"w-4 text-gray-600"}>{icon}</span>
          ) : null}
          {renaming ? (
            <>
              <Button
                variant="plain"
                className="fixed inset-0 z-40 bg-black bg-opacity-[0.01] hover:bg-opacity-[0.01] focus:bg-opacity-[0.01]"
                onPress={() => setRenaming(false)}
              />
              <RenameForm
                name={title}
                onSubmit={async ({ name }) => {
                  if (name.trim() === title.trim()) return
                  await api.view.updateView({
                    id,
                    updateViewRequest: { name: name || "Untitled view" },
                  })
                  setRenaming(false)
                  queryClient.invalidateQueries({
                    queryKey: [api.view.getViews.name],
                  })
                  queryClient.invalidateQueries({
                    queryKey: [api.view.getView.name, id],
                  })
                }}
              />
            </>
          ) : (
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-gray-700">
              {title || "Untitled view"}
            </span>
          )}
        </Link>
        {menu ? (
          <>
            {/* <Link
              {...(drw ? { search: { drw } } : {})}
              className="flex h-5 w-5 items-center justify-center rounded-md text-gray-500 opacity-0 transition duration-100 hover:bg-gray-50 focus:opacity-100 group-hover:opacity-100"
            >
              <Add width={12} />
            </Link> */}
            <Button
              variant="plain"
              className="flex h-5 w-5 items-center justify-center text-gray-500"
              onPress={() => setExpanded(!expanded)}
            >
              <CaretRight
                width={12}
                className={`transform transition duration-200 ${expanded ? "rotate-90" : ""}`}
              />
            </Button>
          </>
        ) : null}
        {isView ? (
          <Menu
            triggerButton={{
              className: `${actionsOpened ? "" : "opacity-0"} h-5 w-5 flex items-center justify-center transition-opacity duration-100 text-gray-500 group-hover:opacity-100`,
              children: <ThreeDotsHorizontal width={14} />,
              onPress: () => setActionsOpened(true),
            }}
            popover={{
              isOpen: actionsOpened,
              onOpenChange: setActionsOpened,
            }}
            items={[
              {
                id: "rename",
                children: "Rename",
                onAction: () => setRenaming(true),
              },
              {
                id: "delete",
                children: "Delete",
                onAction: () => {
                  setActionsOpened(false)
                  setAppState((state) => ({
                    ...state,
                    confirmationModal: {
                      title: `Delete the view "${title}"`,
                      description: "This action cannot be undone.",
                      confirmButton: {
                        children: "Delete",
                        onPress: async () => {
                          await api.view.deleteView({ id })
                          setAppState((state) => ({
                            ...state,
                            confirmationModal: null,
                          }))
                          queryClient.invalidateQueries({
                            queryKey: [api.view.getViews.name],
                          })
                          queryClient.invalidateQueries({
                            queryKey: [api.view.getView.name, id],
                          })
                        },
                      },
                    },
                  }))
                },
              },
            ]}
          />
        ) : null}
      </div>

      {menu && expanded ? <MenuList items={menu} depth={depth + 1} /> : null}
    </div>
  )
}

const MenuList = ({ items, depth }: { items: TMenu[]; depth: number }) => {
  return items?.map((menu) => {
    return <MenuItem key={menu.id} menu={menu} depth={depth} />
  })
}

const MenuGroup = ({
  title,
  icon,
  link,
  menu,
  depth,
}: TMenuGroup & { depth: number }) => {
  const titleChildren = (
    <>
      {icon ?? null}
      {title}
    </>
  )
  return (
    <div key={`${title}`} className="flex flex-col gap-y-1">
      {title ? (
        link ? (
          <Link to={link} className={titleClassName}>
            {titleChildren}
          </Link>
        ) : (
          <div className={cn(titleClassName, "text-gray-500 text-xs")}>
            {titleChildren}
          </div>
        )
      ) : null}
      {menu ? <MenuList items={menu} depth={depth} /> : null}
    </div>
  )
}

const Sidebar = () => {
  const { code } = useWorkspace()
  const api = useWorkspaceApi()
  const navigate = useNavigate()
  const profileMenuGroup: TMenuGroup[] = [
    {
      id: useId(),
      title: "Inbox",
      icon: inboxIcon,
      link: `/w/${code}/inbox`,
    },
    {
      id: useId(),
      title: "Processes",
      link: `/w/${code}/processes`,
      icon: processIcon,
    },
    {
      id: useId(),
      title: "Forms",
      link: `/w/${code}/forms`,
      icon: formIcon,
    },
  ].map((menu) => ({
    ...menu,
    icon: <span className="text-[#967696]">{menu.icon}</span>,
  }))
  const { data: views = [] } = useQuery({
    queryKey: [api.view.getViews.name],
    queryFn: async () => api.view.getViews(),
  })
  const viewsAsMenus = views.map(({ id, name, entityType }) => ({
    id,
    title: name,
    link: `/w/${code}/${entityType === GetViews200ResponseInnerEntityTypeEnum.Candidate ? "candidates" : entityType === GetViews200ResponseInnerEntityTypeEnum.Application ? "applications" : entityType === GetViews200ResponseInnerEntityTypeEnum.Opening ? "openings" : "roles"}/${id}`,
    isView: true,
    entityType,
    icon: (
      <span className="inline-flex text-gray-400">
        {entityType === GetViews200ResponseInnerEntityTypeEnum.Candidate
          ? candidateIcon
          : entityType === GetViews200ResponseInnerEntityTypeEnum.Application
            ? applicationIcon
            : entityType === GetViews200ResponseInnerEntityTypeEnum.Opening
              ? openingIcon
              : roleIcon}
      </span>
    ),
  }))

  const workspaceMenuGroup: TMenuGroup[] = [
    {
      id: useId(),
      title: "Workspace",
      menu: [
        {
          id: useId(),
          title: "Roles",
          link: `/w/${code}/roles`,
          icon: roleIcon,
          drw: { id: "cr8role" },
          // ...(roleViews ? { menu: roleViews } : {}),
        },
        {
          id: useId(),
          title: "Openings",
          link: `/w/${code}/openings`,
          icon: openingIcon,
          drw: { id: "cr8op" },
          // ...(openingViews.length ? { menu: openingViews } : {}),
        },
        {
          id: useId(),
          title: "Applications",
          link: `/w/${code}/applications`,
          icon: applicationIcon,
          drw: { id: "cr8app" },
          // ...(applicationViews ? { menu: applicationViews } : {}),
        },
        {
          id: useId(),
          title: "Candidates",
          link: `/w/${code}/candidates`,
          icon: candidateIcon,
          drw: { id: "cr8cdt" },
          // ...(candidateViews ? { menu: candidateViews } : {}),
        },
      ].map(
        (menu) =>
          ({
            ...menu,
            icon: <span className="text-[#967696]">{menu.icon}</span>,
          }) as TMenu,
      ),
    },
  ]

  const savedMenuGroup: TMenuGroup[] = [
    {
      id: useId(),
      title: "Saved",
      menu: [
        {
          id: useId(),
          title: "Favorites",
          link: `/w/${code}/forms`,
          icon: (
            <svg
              width="16"
              height="16"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Favorite</title>
              <path
                d="M12.8327 8.16666V6.88216C12.8327 5.34682 12.8327 4.57857 12.3835 4.07982C12.3423 4.0338 12.2987 3.98999 12.2528 3.94857C11.7541 3.49999 10.9858 3.49999 9.45052 3.49999H9.23235C8.55977 3.49999 8.22318 3.49999 7.90935 3.41074C7.73713 3.36151 7.57114 3.29261 7.41468 3.20541C7.13002 3.04732 6.89202 2.80874 6.41602 2.33332L6.09518 2.01249C5.93535 1.85266 5.85602 1.77332 5.77202 1.70332C5.41074 1.40386 4.96756 1.22029 4.50035 1.17657C4.39185 1.16666 4.27868 1.16666 4.05352 1.16666C3.53843 1.16666 3.28118 1.16666 3.06652 1.20749C2.60559 1.29454 2.1816 1.51849 1.84986 1.85012C1.51812 2.18175 1.29404 2.60567 1.20685 3.06657C1.16602 3.28182 1.16602 3.53966 1.16602 4.05416V8.16666C1.16602 10.3664 1.16602 11.4666 1.84968 12.1497C2.53335 12.8327 3.63293 12.8333 5.83268 12.8333H8.16602C10.3658 12.8333 11.4659 12.8333 12.149 12.1497C12.8321 11.466 12.8327 10.3664 12.8327 8.16666Z"
                fill="#F98D8D"
              />
              <path
                d="M7.5555 6.53276L7.49833 6.43009C7.27666 6.03168 7.16583 5.83334 7.00016 5.83334C6.8345 5.83334 6.72366 6.03168 6.502 6.43009L6.44483 6.53276C6.38183 6.64593 6.35033 6.70193 6.30133 6.73926C6.25175 6.77659 6.1905 6.79059 6.068 6.81801L5.95716 6.84368C5.52666 6.94109 5.31141 6.98951 5.26008 7.15401C5.20875 7.31851 5.35575 7.49059 5.64916 7.83359L5.725 7.92226C5.80841 8.01968 5.85041 8.06809 5.86908 8.12876C5.88775 8.18943 5.88133 8.25418 5.86908 8.38426L5.85741 8.50268C5.81308 8.96059 5.79091 9.18984 5.9245 9.29134C6.05866 9.39284 6.2605 9.30009 6.66358 9.11459L6.76741 9.06676C6.88233 9.01426 6.9395 8.98801 7.00016 8.98801C7.06083 8.98801 7.118 9.01426 7.23291 9.06676L7.33675 9.11459C7.73983 9.30068 7.94166 9.39284 8.07583 9.29134C8.21 9.18984 8.18725 8.96059 8.14291 8.50268L8.13125 8.38426C8.119 8.25418 8.11258 8.18943 8.13125 8.12876C8.14991 8.06809 8.19191 8.01968 8.27533 7.92226L8.35116 7.83359C8.64458 7.49059 8.79158 7.31909 8.74025 7.15401C8.68891 6.98951 8.47366 6.94109 8.04316 6.84368L7.93233 6.81801C7.80983 6.79059 7.74858 6.77718 7.699 6.73926C7.65 6.70193 7.6185 6.64593 7.5555 6.53276Z"
                fill="#FAF5FA"
              />
            </svg>
          ),
        },
      ],
    },
    ...viewsAsMenus,
  ]
  // <Button
  //             variant="plain"
  //             className="flex h-12 flex-1 items-center px-3.5 hover:bg-gray-100"
  //           >
  //             <figure className="mr-2 h-6 w-6 rounded-md bg-emerald-500 text-center text-white leading-6">
  //               F
  //             </figure>
  //             <span className="mr-1">Fourvill</span>
  //             <span className="h-3.5 w-3.5 overflow-hidden">
  //               <CaretDown width={14} />
  //             </span>
  //           </Button>

  return (
    <aside className="flex w-full max-w-[260px] flex-col gap-y-6 px-5 pt-4">
      <div className="flex h-10 items-center">
        <WorkspaceMenu />
      </div>
      <div className="hidden pt-1.5">
        <Button
          variant="plain"
          className="flex h-7 w-auto items-center gap-x-1 rounded-lg border border-gray-200 border-solid border-opacity-65 bg-white bg-opacity-40 p-1 px-1 pr-4"
        >
          <span className="h-3.5 w-3.5 overflow-hidden">
            <Search width={14} height={14} />
          </span>
          <span className="">Search</span>
        </Button>
      </div>
      <div className="">
        <div className="flex flex-col gap-y-5">
          <div className="border-b border-b-[#EDEEF0] pb-5">
            <Menu
              triggerButton={{
                className: "flex items-center gap-x-1.5 h-7 text-[#374151]",
                children: (
                  <>
                    <AddSquareBold
                      width={16}
                      height={16}
                      className="text-purpleX11"
                    />
                    <span className="">Add</span>
                  </>
                ),
              }}
              onAction={(key) => {
                const id = key as string
                switch (id) {
                  case "add-member":
                    navigate({
                      to: "",
                      search: {
                        mdl: {
                          id: "inv-u",
                        },
                      },
                    })
                    break

                  default:
                    break
                }
              }}
              items={[
                {
                  id: "add-member",
                  children: "Member",
                },
              ]}
            />
            {profileMenuGroup.map((props) => (
              <MenuGroup key={props.id} {...props} />
            ))}
          </div>
          {/* <div className="">
            {systemMenuGroup.map((props) => (
              <MenuGroup key={props.id} {...props} depth={0} />
            ))}
          </div> */}
          <div className="">
            {workspaceMenuGroup.map((props) => (
              <MenuGroup key={props.id} {...props} depth={0} />
            ))}
          </div>
          <div>
            {savedMenuGroup.map((props) => (
              <MenuGroup key={props.id} {...props} depth={0} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

/**
 * Jobs
 * Applications
 * Candidates
 *
 * Closed two hires for job in 2 months
 * Openings allow you to split roles by teams
 *
 * Inbox
 * What's next
 *
 * Workspace
 * Roles
 * Processes/Journeys/Stages
 *
 * Openings
 * Applications
 * Candidates
 */
