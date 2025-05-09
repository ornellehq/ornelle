import { useQuery } from "@tanstack/react-query"
import {
  Link,
  matchByPath,
  useLocation,
  useNavigate,
} from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "webui-library/src/button"
import Add from "webui-library/src/icons/Add"
import DashboardSquare03 from "webui-library/src/icons/huge-icons/dashboard-square-03"
import Logout02 from "webui-library/src/icons/huge-icons/logout-02"
import Moon02 from "webui-library/src/icons/huge-icons/moon-02"
import Sun03 from "webui-library/src/icons/huge-icons/sun-03"
import CaretUpDown from "webui-library/src/icons/phosphor/caret-up-down"
import Settings05 from "webui-library/src/icons/settings-05"
import ListBox from "webui-library/src/list-box"
import ListBoxItem from "webui-library/src/list-box-item"
import { Switch } from "webui-library/src/switch"
import Menu from "webui-library/src/widgets/menu"
import { useRootContext, useSignOut, useUser } from "~/core/user/hooks"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useWorkspace } from "~/core/workspace/workspace.context"

const WorkspaceMenu = () => {
  const logout = useSignOut()
  const api = useWorkspaceApi()
  const navigate = useNavigate()
  const { name, url } = useWorkspace()
  const { email } = useUser()
  const { updateTheme, theme } = useRootContext()
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false)
  const { data: workspaces = [] } = useQuery({
    queryKey: [api.workspace.getWorkspaces.name],
    queryFn: () => api.workspace.getWorkspaces(),
  })
  const location = useLocation()

  const topItems: (NonNullable<
    React.ComponentProps<typeof Menu>["items"]
  >[number] & { id: string })[] = [
    {
      id: "settings",
      children: (
        <>
          <Settings05 width={16} className="text-gray-500" />
          Settings
        </>
      ),
    },
  ]
  const bottomItems: (NonNullable<
    React.ComponentProps<typeof Menu>["items"]
  >[number] & { id: string })[] = [
    // {
    //   id: "documentation",
    //   children: (
    //     <>
    //       <BookOpen02 width={14} className="text-gray-500" />
    //       Documentation
    //     </>
    //   ),
    // },
    // {
    //   id: "install",
    //   children: (
    //     <>
    //       <Download05 width={14} className="text-gray-500" />
    //       Install
    //     </>
    //   ),
    // },
    {
      id: "sign-out",
      children: (
        <>
          <Logout02 width={16} className="text-gray-500" />
          Sign out
        </>
      ),
    },
  ]
  const basename = "" // location.href.replace(location.pathname, "")
  const pathname = location.pathname
  const result = matchByPath(basename, pathname, {
    to: "/w/$code",
    fuzzy: true,
    caseSensitive: false,
  })

  return (
    <>
      <Menu
        triggerButton={{
          className:
            "w-full flex flex-1 -ml-1 px-1 text-left hover:bg-transparent",
          onPress: () => setIsWorkspaceMenuOpen((prev) => !prev),
          children: (
            <>
              {/* <figure
              className={`mr-2 h-6 w-6 overflow-hidden rounded-md text-center text-white leading-6 ${logoSlug ? "" : "bg-emerald-500"}`}
            >
              {logoSlug ? (
                <img
                  src={`http://localhost:3000/workspace/files/${logoSlug}`}
                  alt="Workspace logo"
                  className="h-full w-full object-contain object-center"
                />
              ) : (
                name.substring(0, 2)
              )}
            </figure> */}
              <div className="flex-1 overflow-hidden">
                <div className="mr-1 font-bold text-[15px] leading-none">
                  {name}
                </div>
                <div className="overflow-hidden text-ellipsis text-[#B499B4] text-xs">
                  {email}
                </div>
              </div>
            </>
          ),
        }}
        popover={{
          className:
            "flex flex-col divide-y divide-gray-100/80 overflow-hidden",
          onOpenChange: (open) => setIsWorkspaceMenuOpen(open),
          children: (
            <>
              <div className="px-1 py-2">
                <div className="px-1 text-gray-400 text-xs">Workspaces</div>
                <Menu
                  triggerButton={{
                    className:
                      "h-8 leading-8 flex items-center gap-x-2 px-1 w-full text-left",
                    children: (
                      <>
                        <DashboardSquare03
                          width={16}
                          className="text-gray-500"
                        />
                        <span className="flex-1">{name}</span>
                        <CaretUpDown className="text-gray-500" />
                      </>
                    ),
                  }}
                  popover={{
                    placement: "right top",
                    children: (
                      <>
                        {workspaces.map(({ name, id, url: _url }) => (
                          <Link
                            key={id}
                            {...(url === _url
                              ? { to: "." }
                              : {
                                  to: result?.code
                                    ? location.pathname.replace(
                                        result.code,
                                        _url,
                                      )
                                    : "/w/$code",
                                  params: { code: _url },
                                })}
                            className="block h-8 gap-x-2 px-2 leading-8 outline-none focus:bg-slate-50"
                            onClick={() => setIsWorkspaceMenuOpen(false)}
                          >
                            {name}
                          </Link>
                        ))}
                        <Link
                          to="/u/workspaces/create"
                          className="flex h-8 w-full items-center justify-center gap-x-1 border-gray-200 border-t text-gray-600 leading-8 outline-none focus:bg-slate-50"
                        >
                          <Add width={12} />
                          <span>New workspace</span>
                        </Link>
                      </>
                    ),
                  }}
                />
              </div>
              <Switch
                className="flex flex-row-reverse px-2 py-2 font-normal text-sm"
                isSelected={theme === "dark"}
                onChange={(checked) => {
                  updateTheme(checked ? "dark" : "light")
                }}
              >
                <span className="flex-1">Invert theme</span>
                {theme === "dark" ? <Moon02 /> : <Sun03 />}
              </Switch>
              <ListBox
                autoFocus
                className="rounded-none"
                onAction={async (key) => {
                  switch (key) {
                    case "settings":
                      {
                        navigate({
                          to: "/w/$code/settings/workspace",
                          params: { code: url },
                        })
                      }
                      break
                  }
                }}
              >
                {topItems.map((item) => (
                  <ListBoxItem
                    key={item.id}
                    id={item.id}
                    className="flex h-8 cursor-pointer items-center gap-x-2 px-2 leading-8 outline-none focus:bg-slate-50"
                  >
                    {item.children}
                  </ListBoxItem>
                ))}
              </ListBox>

              <ListBox
                className="rounded-none pt-1"
                onAction={async (key) => {
                  switch (key) {
                    case "sign-out":
                      {
                        logout()
                      }
                      break
                  }
                }}
              >
                {bottomItems.map((item) => (
                  <ListBoxItem
                    key={item.id}
                    id={item.id}
                    className="flex h-8 cursor-pointer items-center gap-x-2 px-2 leading-8 outline-none focus:bg-slate-50"
                  >
                    {item.children}
                  </ListBoxItem>
                ))}
              </ListBox>
            </>
          ),
        }}
      />
      <Button
        variant="plain"
        className="hidden h-8 w-8 items-center justify-center text-[#786474]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Search</title>
          <g clipPath="url(#clip0_347_1205)">
            <path
              d="M8.75 8.75L11 11M10 5.5C10 4.30653 9.52589 3.16193 8.68198 2.31802C7.83807 1.47411 6.69347 1 5.5 1C4.30653 1 3.16193 1.47411 2.31802 2.31802C1.47411 3.16193 1 4.30653 1 5.5C1 6.69347 1.47411 7.83807 2.31802 8.68198C3.16193 9.52589 4.30653 10 5.5 10C6.69347 10 7.83807 9.52589 8.68198 8.68198C9.52589 7.83807 10 6.69347 10 5.5Z"
              stroke="#786474"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_347_1205">
              <rect width="12" height="12" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </Button>
    </>
  )
}

export default WorkspaceMenu

/**
 * Workspaces
 * Create workspace,
 */
