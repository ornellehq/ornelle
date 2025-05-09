import { useQuery } from "@tanstack/react-query"
import {
  type NavigateOptions,
  Outlet,
  type ToOptions,
  createRootRoute,
  useLocation,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { useState } from "react"
import { RouterProvider } from "react-aria-components"
import { type Theme, rootContext } from "~/core/user/hooks"
import { getUser } from "~/core/user/shared"

//  See https://react-spectrum.adobe.com/react-aria/routing.html#tanstack-router
declare module "react-aria-components" {
  interface RouterConfig {
    href: ToOptions["to"]
    routerOptions: Omit<NavigateOptions, keyof ToOptions>
  }
}

export const Route = createRootRoute({
  component: Root,
  errorComponent: () => {
    // if (error.name === "Unauthorized")
    return <div>An error occurred</div>
  },
})

function Root() {
  const navigate = useNavigate()
  const location = useLocation()
  const router = useRouter()
  const { data: user, status } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser({ location, navigate }),
    enabled: true,
  })
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "light",
  )

  if (status === "pending") return <div />

  const updateTheme = (theme: Theme) => {
    setTheme(theme)
    localStorage.setItem("theme", theme)
  }

  return (
    <rootContext.Provider
      value={{
        ...(user?.user ? { user: user.user } : {}),
        theme,
        updateTheme,
        filesBaseUrl: user?.filesBaseUrl ?? "",
      }}
    >
      {theme === "dark" ? (
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: `@media screen {
        /* Leading rule */
        html {
          -webkit-filter: invert(100%) hue-rotate(180deg) contrast(90%) !important;
        } /* Contrary rule */
        img,
        video,
        :not(object):not(body) > embed,
        object,
        iframe,
        svg image,
        [style*=\'background:url\'],
        [style*=\'background-image:url\'],
        [style*=\'background: url\'],
        [style*=\'background-image: url\'],
        [background],
        twitterwidget,
        .ms-ColorPicker, .color-preview::before {
          -webkit-filter: invert(100%) hue-rotate(180deg) !important;
        }
        [style*=\'background:url\'] *,
        [style*=\'background-image:url\'] *,
        [style*=\'background: url\'] *,
        [style*=\'background-image: url\'] *,
        input,
        [background] * {
          -webkit-filter: none !important;
        }
        /*iframe:not([title=\'Disqus\']):not([src*=\'ihlenndgcmojhcghmfjfneahoeklbjjh\']) {
          background: white !important;
        }*/ /* Text contrast */
        html {
          text-shadow: 0 0 0 !important;
        } /* Full screen */
        *:-webkit-full-screen,
        *:-webkit-full-screen * {
          -webkit-filter: none !important;
        } /* Custom rules */
        #disqus_thread > :first-child {
          background: black !important;
        }
      }`,
          }}
        />
      ) : null}
      <RouterProvider
        navigate={(to, options) =>
          router.navigate({ to: to ?? ".", ...options })
        }
        useHref={(to = ".") => router.buildLocation({ to }).href}
      >
        <Outlet />
      </RouterProvider>
    </rootContext.Provider>
  )
}
