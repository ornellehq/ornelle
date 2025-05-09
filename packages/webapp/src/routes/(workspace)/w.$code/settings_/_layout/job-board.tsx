import { useQuery } from "@tanstack/react-query"
import { Link, type ToOptions, createFileRoute } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import Add from "webui-library/src/icons/Add"
import X from "webui-library/src/icons/X"
import ArrowUpRight01 from "webui-library/src/icons/arrow-up-right-01"
import Note01 from "webui-library/src/icons/note-01"
import Menu from "webui-library/src/widgets/menu"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import { useWorkspace } from "~/core/workspace/workspace.context"

export const Route = createFileRoute(
  "/(workspace)/w/$code/settings_/_layout/job-board",
)({
  component: JobBoard,
})

function JobBoard() {
  const api = useWorkspaceApi()
  const { url } = useWorkspace()
  const { data: attributes } = useEntityAttributes([
    GetAttributesEntityTypesEnum.Opening,
    GetAttributesEntityTypesEnum.Role,
  ])
  const queryKey = [api.listingTheme.getListingTheme.name]
  const { data: listingTheme } = useQuery({
    queryKey,
    queryFn: async () => api.listingTheme.getListingTheme({ id: "default" }),
  })
  const { propertiesToShow = [] } = (listingTheme?.openingConfig ?? {
    propertiesToShow: [],
  }) as { propertiesToShow: string[] }

  const pages: {
    id: string
    title: string
    description: string
    path: ToOptions
    children?: ReactNode
  }[] = [
    {
      id: "landing",
      title: "Landing",
      description: "The main job board page displaying all job openings.",
      path: {
        to: "",
        search: {
          drw: {
            id: "jbl",
          },
        },
      },
    },
    {
      id: "opening",
      title: "Opening",
      description: "The detailed view of a specific opening.",
      path: {
        to: "",
        search: {
          drw: {
            id: "jbo",
          },
        },
      },
      children: (
        <div className="mt-3 flex text-[13px]">
          <div className="mr-4 w-40" />
          <div className="flex-1 border-gray-100 border-t px-1 py-3">
            <div className="mb-1 text-gray-600">Properties to show</div>
            <div className="flex items-center gap-x-2">
              {propertiesToShow.map((id) => {
                const attribute = attributes.find(
                  (attribute) => attribute.id === id,
                )
                if (!attribute) return null

                return (
                  <Button
                    key={id}
                    variant="plain"
                    className="flex h-6 items-center bg-slate-100 px-1.5 leading-6"
                    onPress={async () => {
                      if (listingTheme) {
                        await api.listingTheme.upsertListingTheme({
                          id: "default",
                          upsertListingThemeRequest: {
                            ...listingTheme,
                            openingConfig: {
                              ...listingTheme.openingConfig,
                              propertiesToShow: propertiesToShow.filter(
                                (prop) => prop !== id,
                              ),
                            },
                          },
                        })
                        queryClient.invalidateQueries({ queryKey })
                      }
                    }}
                  >
                    <span className="mr-1 inline-block">{attribute.name}</span>
                    <X width={10} />
                  </Button>
                )
              })}
              <Menu
                triggerButton={{
                  className:
                    "h-5 w-5 inline-flex justify-center items-center border border-gray-200",
                  children: (
                    <>
                      <Add width={12} />
                    </>
                  ),
                }}
                items={attributes
                  .filter(({ id }) => !propertiesToShow.includes(id))
                  .map(({ name, id }) => ({
                    id,
                    children: name,
                  }))}
                onAction={async (key) => {
                  const id = key as string
                  if (listingTheme) {
                    await api.listingTheme.upsertListingTheme({
                      id: "default",
                      upsertListingThemeRequest: {
                        ...listingTheme,
                        openingConfig: {
                          ...listingTheme.openingConfig,
                          propertiesToShow: [...propertiesToShow, id],
                        },
                      },
                    })
                    queryClient.invalidateQueries({ queryKey })
                  }
                }}
              />
            </div>
          </div>
        </div>
      ),
    },
  ]
  return (
    <div className="">
      <div className="mb-8">
        <h1 className="mb-1 text-3xl">Job board</h1>
        <div className="text-[13px] text-gray-600">
          Settings for your public job board.{" "}
          <a
            href={`${import.meta.env.VITE_PAGES_SERVER}/j/${url}`}
            rel="noreferrer"
            target="_blank"
            className="inline-flex items-center rounded-md text-blue-400"
          >
            Preview
            <ArrowUpRight01 />
          </a>
        </div>
      </div>
      <div className="flex justify-between">
        <div>Pages</div>
        <div className="flex w-full max-w-lg flex-col gap-y-10">
          {pages.map(({ id, title, description, path, children }) => {
            return (
              <div key={id}>
                <div className="flex">
                  <div className="mr-4 flex h-24 w-40 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-400">
                    <Note01 className="h-7 w-7" />
                  </div>
                  <div className="flex flex-1 flex-col p-1">
                    <div className="mb-1">{title}</div>
                    <p className="mb-3 flex-1 text-gray-600 text-sm">
                      {description}
                    </p>
                    <Link
                      {...path}
                      className="inline-block self-start rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs leading-none"
                    >
                      Customize
                    </Link>
                  </div>
                </div>
                {children}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
