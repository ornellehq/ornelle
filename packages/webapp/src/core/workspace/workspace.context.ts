import {
  type ComponentProps,
  type ReactNode,
  createContext,
  useContext,
} from "react"
import type { Button } from "webui-library/src/button"
import type { getWorkspaceInfo } from "./utils"

export interface AppState {
  entityView: "new" | "default"
  confirmationModal: {
    title: ReactNode
    description: ReactNode
    confirmButton: ComponentProps<typeof Button>
  } | null
}

export interface GetWorkspaceInfoReturn
  extends Awaited<ReturnType<typeof getWorkspaceInfo>> {}
export interface WorkspaceInfo extends Partial<GetWorkspaceInfoReturn> {}

interface WorkspaceContext extends WorkspaceInfo {
  code: string
  appState: AppState
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
}

export const workspaceContext = createContext<WorkspaceContext>({
  code: "",
  appState: {
    entityView: "default",
    confirmationModal: null,
  },
  setAppState: () => {},
})

export const useWorkspace = () => {
  const { workspace } = useContext(workspaceContext) as GetWorkspaceInfoReturn

  return workspace
}
// useRouteContext({ from: "/w/$code" }).workspace // () => useContext(workspaceContext)
export const useWorkspaceContext = () => useContext(workspaceContext)
