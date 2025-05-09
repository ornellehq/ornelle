import { useNavigate, useRouter } from "@tanstack/react-router"
import { createContext, useContext } from "react"
import { workspacePreloadCache } from "../workspace/globals.js"
import { type getUser, userApi, userPreloadCache } from "./shared.js"

export const useSignOut = () => {
  const router = useRouter()
  const navigate = useNavigate()

  return async () => {
    workspacePreloadCache.data = null
    userPreloadCache.data = null
    userApi.logOut()
    await router.invalidate()
    navigate({ to: "/welcome/email" })
  }
}

export type Theme = "light" | "dark"
export interface RootContext
  extends Partial<Awaited<ReturnType<typeof getUser>>> {
  theme: Theme
  updateTheme: (theme: Theme) => void
  filesBaseUrl: string
}
export const rootContext = createContext<RootContext>({
  theme: "light",
  updateTheme: () => {},
  filesBaseUrl: "",
})
export const useRootContext = () => useContext<RootContext>(rootContext)
// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const useUser = () => useContext(rootContext).user!
export const useFilesBaseUrl = () => useContext(rootContext).filesBaseUrl
