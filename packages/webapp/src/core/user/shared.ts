import {
  type MatchLocation,
  type NavigateFn,
  type ParsedLocation,
  matchByPath,
} from "@tanstack/react-router"
import {
  Configuration,
  type GetCurrentUser200Response,
  ResponseError,
  UserApi,
} from "sdks/src/server-sdk"
import { queryClient } from "../network"

export const userApi = new UserApi(
  new Configuration({
    basePath: import.meta.env.VITE_MAIN_SERVER,
    credentials: "include",
  }),
)

export const resetUserQuery = () =>
  queryClient.resetQueries({ queryKey: ["user"] })

export const userPreloadCache = { data: null }

const checkers: (MatchLocation & {
  validate(args: {
    signedIn: boolean
    hasAccount: boolean
  }): { to?: string }
})[] = [
  {
    to: "",
    fuzzy: false,
    validate: ({ signedIn, hasAccount }) => {
      return signedIn
        ? { to: hasAccount ? "/u/workspaces" : "/u/signup" }
        : { to: "/welcome/email" }
    },
  },
  {
    to: "/w",
    fuzzy: false,
    validate: ({ signedIn, hasAccount }) => {
      return signedIn
        ? hasAccount
          ? { to: "/u/workspaces" }
          : { to: "/u/signup" }
        : { to: "/welcome/email" }
    },
  },
  {
    to: "/w",
    fuzzy: true,
    validate: ({ signedIn, hasAccount }) => {
      return signedIn
        ? hasAccount
          ? {}
          : { to: "/u/signup" }
        : { to: "/welcome/email" }
    },
  },
  {
    to: "/welcome",
    fuzzy: true,
    validate: ({ signedIn, hasAccount }) => {
      return signedIn
        ? {
            to: hasAccount ? "/u/workspaces" : "/u/signup",
          }
        : {}
    },
  },
  {
    to: "/u/workspaces",
    fuzzy: true,
    validate: ({ signedIn, hasAccount }) => {
      return hasAccount
        ? {}
        : signedIn
          ? { to: "/u/signup" }
          : { to: "/welcome/email" }
    },
  },
  {
    to: "/u/signup",
    fuzzy: true,
    validate: ({ signedIn, hasAccount }) => {
      return signedIn
        ? hasAccount
          ? { to: "/u/workspaces" }
          : {}
        : { to: "/welcome/email" }
    },
  },
  {
    to: "/u",
    fuzzy: true,
    validate: ({ signedIn }) => {
      return signedIn ? {} : { to: "/welcome/email" }
    },
  },
]

export const getUser = async ({
  location,
  navigate,
}: { location: ParsedLocation; navigate: NavigateFn }) => {
  const response = await userApi
    .getCurrentUser()
    .catch((err) => err as ResponseError | Error)
  const checker = checkers.find((toOptions) => {
    const basename = location.href.replace(location.pathname, "")
    const pathname = location.pathname
    const result = matchByPath(basename, pathname, toOptions)
    return !!result
  })
  const { status, data } =
    response instanceof ResponseError
      ? response.response.status === 404
        ? {
            status: "authorized",
            data: response as unknown as GetCurrentUser200Response,
          }
        : response.response.status === 401
          ? { status: "unauthorized" }
          : { status: "server_error" }
      : "name" in response
        ? { status: "unknown_error" }
        : { status: "authorized", data: response }
  const { to } =
    checker?.validate({
      signedIn: status === "authorized",
      hasAccount: !!data?.data?.id,
    }) ?? {}

  if (to) navigate({ to })

  // TODO: Remove non-null assertion
  // biome-ignore lint/style/noNonNullAssertion: Will be fixed
  return { user: data?.data, filesBaseUrl: data?.meta?.filesBaseUrl! }
}
