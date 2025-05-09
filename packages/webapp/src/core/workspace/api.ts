import { useContext } from "react"
import { Configuration, RoleApi, WorkspaceApi } from "sdks/src/server-sdk"
import { queryClient } from "../network"
import { workspaceContext } from "./workspace.context"

export const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_MAIN_SERVER,
  credentials: "include",
})

export const workspaceApi = new WorkspaceApi(apiConfiguration)
export const roleApi = new RoleApi(apiConfiguration)

export const invalidateWorkspaceInfo = async (code: string) => {
  return queryClient.invalidateQueries({ queryKey: ["workspace", code] })
}

export const useWorkspaceApi = () => {
  const { api } = useContext(workspaceContext)
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return api!
} // useRouteContext({ from: "/w/$code" }).api
