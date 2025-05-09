import { useQuery } from "@tanstack/react-query"
import {
  type MatchLocation,
  Navigate,
  matchByPath,
  useLocation,
} from "@tanstack/react-router"
import { useMemo } from "react"
import { ResponseError } from "sdks/src/server-sdk"
import { userApi } from "~/core/user/shared"

const checkers: (MatchLocation & {
  validate(args: {
    signedIn: boolean
    hasWorkspace: boolean
    hasAccount: boolean
  }): { to?: string }
})[] = [
  {
    to: "/w/",
    fuzzy: true,
    validate: ({ signedIn }) => {
      return signedIn ? {} : { to: "/welcome/email" }
    },
  },
  {
    to: "/welcome",
    fuzzy: true,
    validate: ({ signedIn, hasWorkspace, hasAccount }) => {
      return signedIn
        ? {
            to: hasAccount
              ? hasWorkspace
                ? "/u/workspaces"
                : "/u/workspaces/create"
              : "/u/signup",
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
    validate: ({ signedIn, hasWorkspace, hasAccount }) => {
      return signedIn
        ? hasAccount
          ? hasWorkspace
            ? { to: "/u/workspaces" }
            : { to: "/u/workspaces/create" }
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

// Gets user auth status and redirects based on currect URL
const CheckAuth = ({ children }: React.PropsWithChildren<object>) => {
  const location = useLocation()
  const {
    data: [error, response] = [null, null],
    status,
  } = useQuery({
    queryKey: [userApi.getCurrentUser.name],
    queryFn: async () => {
      const response = await userApi
        .getCurrentUserRaw()
        .catch((err) => err as ResponseError | Error)

      return response instanceof Error
        ? ([response, null] as const)
        : ([null, await response.value()] as const)
    },
    retry: false,
  })

  // Other error
  const isUnknowmError = error && !(error instanceof ResponseError)

  const { to }: { to?: string } = useMemo(() => {
    if (isUnknowmError) return {}

    const signedIn = error?.response.status !== 401

    return (
      checkers
        .find((toOptions) => {
          const result = matchByPath(
            location.href.replace(location.pathname, ""),
            location.pathname,
            toOptions,
          )

          return !!result
        })
        ?.validate({
          signedIn,
          hasWorkspace: !!response?.meta?.hasWorkspace,
          hasAccount: !!response?.data?.id,
        }) ?? {}
    )
  }, [
    error,
    isUnknowmError,
    location.href,
    location.pathname,
    response?.meta?.hasWorkspace,
    response?.data?.id,
  ])

  if (status === "pending") return <div>Loading</div>

  return isUnknowmError ? (
    <>An error occurred</>
  ) : to ? (
    <Navigate to={to} replace />
  ) : (
    <>{children}</>
  )
}

export default CheckAuth
