import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import dayjs from "dayjs"
import type { Prisma } from "isomorphic-blocs/src/prisma.js"
import { useEffect, useState } from "react"
import { type FieldValues, useForm } from "react-hook-form"
import type { GetOpening200Response } from "sdks/src/server-sdk/index.js"
import Calendar from "webui-library/src/icons/Calendar.js"
import CaretRight from "webui-library/src/icons/CaretRight.js"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useSyncEntityForm } from "~/core/workspace/entities/hooks.js"
import { globals } from "~/core/workspace/globals.js"
import { useWorkspaceParams } from "~/core/workspace/navigation.js"
import Save from "~/routes/-components/save/save.js"
import EntityLayoutRte from "../components/EntityLayoutRte.js"
import EntityLayout from "../components/entity-layout.js"
import { PanelHeaderLeftSlot } from "../slot.js"
import ViewTabs from "../view-tabs.js"
import useBuiltInFields from "./built-in-fields.js"

export type View = "details" | "applications"

interface OpeningProps {
  id: string
}

const OpeningApplications = ({
  opening,
}: { opening: GetOpening200Response }) => {
  const { code } = useWorkspaceParams()
  const { id } = opening
  const api = useWorkspaceApi()
  const {
    data: { applications } = {},
  } = useQuery({
    queryKey: [api.application.getApplications, id],
    queryFn: async () => {
      const input: Prisma.ApplicationFindManyArgs = {
        where: {
          openingId: id,
        },
        take: 6,
        orderBy: {
          createdAt: "desc",
        },
      }
      const response = await api.application.getApplicationsRaw({ input })
      const hasNextPage = response.raw.headers.get("x-has-next-page")

      return { applications: await response.value(), hasNextPage }
    },
  })

  return (
    <>
      <ul className="mx-6 flex flex-col gap-y-2">
        {applications?.map((application) => {
          const { id, candidate, createdAt } = application
          return (
            <li key={id}>
              <Link
                to="."
                search={{ drw: { id: "ap", e: id } }}
                className="block rounded-lg border border-gray-200 border-opacity-80 p-3.5"
              >
                <div className="">
                  <div className="flex items-center">
                    {/* <figure className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-slate-100 text-gray-400">
                      <User width={12} />
                    </figure> */}
                    <div>
                      <div className="mb-1 font-medium">
                        {candidate.firstName} {candidate.lastName}
                      </div>
                      <div className="flex items-center text-gray-500 text-xs">
                        <span className="mr-2 inline-flex items-center">
                          <Calendar width={12} className="mr-1" />
                          <span>
                            {dayjs(createdAt).format("ddd, MMM D, YYYY h:mm A")}
                          </span>
                        </span>
                        <span />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="mt-3 flex items-center gap-x-1">
                  {attributes.map((attribute) => {
                    const { id, name, _configuration } = attribute
                    const Editor =
                      attributeEditors[attribute.dataType] ?? (() => <></>)
                    const value = application[id]

                    if (!value) return null

                    return (
                      <div
                        key={id}
                        variant="plain"
                        className="relative block h-5 rounded bg-gray-50 px-2 text-left text-gray-600 text-xs leading-5 hover:bg-gray-100"
                      >
                        {value}
                      </div>
                    )
                  })}
                </div> */}
                {/* <EntityFields
                attributes={attributes}
                form={form}
                // {...(onValueUpdate ? { onValueUpdate } : {})}
              /> */}
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="mx-6 mt-2 flex items-center justify-between text-xs">
        {/* <h3 className="px-1 text-gray-500">Recent applications</h3> */}
        {/* {hasNextPage === "true" ? ( */}
        <Link
          to="/w/$code/applications"
          params={{ code }}
          className="inline-flex items-center"
        >
          <span className="mr-0.5">View all</span>
          <CaretRight width={12} />
        </Link>
        {/* ) : null} */}
      </div>
    </>
  )
}

let cachedView: View = "details"
const OpeningWithData = ({
  id,
  data,
}: OpeningProps & { data: GetOpening200Response }) => {
  const api = useWorkspaceApi()
  const queryKey = [api.opening.getOpening.name, id]
  const form = useForm<FieldValues>({
    defaultValues: {
      ...data,
      createdAt: dayjs(data.createdAt).format("MMMM DD, YYYY h:m A"),
    },
  })
  const [view, setView] = useState<View>(cachedView)

  useEffect(() => {
    return () => {
      cachedView = view
    }
  }, [view])

  const builtInFields = useBuiltInFields()
  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: [api.opening.getOpening.name, data.id],
    })
    queryClient.invalidateQueries({
      queryKey: [api.opening.getOpenings.name, globals.filters, globals.sorts],
    })
  }

  useSyncEntityForm({ form, data })

  return (
    <EntityLayout
      id={data.id}
      entityType="Opening"
      title={null}
      builtInAttributes={builtInFields}
      createdAt={data.createdAt}
      form={form}
      updateHandlers={{
        roleId: async (data) => {
          if (typeof data.value === "string") {
            await api.opening.updateAnOpening({
              id,
              updateAnOpeningRequest: {
                role: data.value,
              },
            })
            invalidateQueries()
          }
        },
        workflowId: async (data) => {
          if (typeof data.value === "string") {
            await api.opening.updateAnOpening({
              id,
              updateAnOpeningRequest: {
                workflow: data.value,
              },
            })
            invalidateQueries()
          }
        },
        formId: async (data) => {
          if (typeof data.value === "string") {
            await api.opening.updateAnOpening({
              id,
              updateAnOpeningRequest: {
                form: data.value,
              },
            })
            invalidateQueries()
          }
        },
      }}
      showCustomAttributes={view === "details"}
    >
      <div className="flex px-6">
        <ViewTabs<View>
          view={view}
          setView={setView}
          tabs={[
            {
              id: "details",
              children: (
                <>
                  <span>Details</span>
                </>
              ),
            },
            {
              id: "applications",
              children: (
                <>
                  <span>Recent applications</span>
                </>
              ),
            },
          ]}
        />
      </div>
      {view === "details" ? (
        <EntityLayoutRte
          {...(data?.description?.html
            ? { defaultContent: data?.description?.html }
            : {})}
          html={data.description?.html ?? ""}
          onBlur={async ({ editor }) => {
            const data = {
              html: editor.getHTML(),
              json: editor.getJSON(),
            }
            await api.opening.updateAnOpening({
              id,
              updateAnOpeningRequest: { description: data },
            })
            queryClient.invalidateQueries({ queryKey })
            // updateView({ expandedDescription: false })
          }}
        />
      ) : (
        <OpeningApplications opening={data} />
      )}
    </EntityLayout>
  )
}

const Opening = ({ id }: OpeningProps) => {
  const api = useWorkspaceApi()
  const queryKey = [api.opening.getOpening.name, id]
  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const opening = await api.opening.getOpening({ id })
      return opening
    },
  })

  return (
    <>
      {data ? (
        <OpeningWithData id={id} data={data} />
      ) : (
        <div className="3xl:w-[36rem] w-[28rem] 2xl:w-[32rem]" />
      )}
      <PanelHeaderLeftSlot>
        <div className="flex items-center">
          {data ? (
            <Save entityType="Opening" entityId={id} name={data.title ?? ""} />
          ) : null}
        </div>
      </PanelHeaderLeftSlot>
    </>
  )
}

export default Opening
