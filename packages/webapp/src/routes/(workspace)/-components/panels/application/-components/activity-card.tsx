import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import type { Message, Prisma, Review } from "isomorphic-blocs/src/prisma"
import type { FormResponse } from "isomorphic-blocs/src/types/form"
import { useState } from "react"
import {
  type CreateApplication200Response,
  GetActivities200ResponseInnerSourceEnum,
  GetActivities200ResponseInnerTypeEnum,
} from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import ArrowRight from "webui-library/src/icons/huge-icons/arrow-right-02"
import Circle from "webui-library/src/icons/huge-icons/circle"
import { useWorkspaceApi } from "~/core/workspace/api"
import Card from "./card"

dayjs.extend(relativeTime)

interface ActivityCardProps {
  application: CreateApplication200Response
  onAddComment?: () => void
  expanded?: boolean
  onExpand?: () => void
}

const ActivityCard = ({
  application,
  onAddComment,
  expanded = false,
  onExpand,
}: ActivityCardProps) => {
  const [showMore, setShowMore] = useState(false)
  const api = useWorkspaceApi()
  const activityTypeEnum = GetActivities200ResponseInnerTypeEnum

  // Time display component to show consistent time format
  const TimeDisplay = ({ time }: { time: Date | string }) => (
    <div className="flex items-center gap-x-2 text-gray-500">
      <span className="rounded-full border border-white bg-white">
        <Circle width={10} />
      </span>
      <span>
        {dayjs(time).isAfter(dayjs().subtract(24, "hour"))
          ? dayjs(time).format("HH:mm")
          : dayjs(time).fromNow()}
      </span>
    </div>
  )

  // Fetch real activities data
  const activitiesQueryKey = [api.activity.getActivities.name, application.id]
  const { data: activities = [] } = useQuery({
    queryKey: activitiesQueryKey,
    queryFn: async () => {
      const input = {
        where: {
          entityType: "Application",
          entityId: application.id,
        },
      } as Prisma.ActivityFindManyArgs
      return api.activity.getActivities({ input })
    },
  })

  // Fetch creator profile
  const { data: profiles = [] } = useQuery({
    queryKey: [api.profile.getProfiles.name],
    queryFn: async () => {
      return api.profile.getProfiles()
    },
  })

  // Get creator information
  const creator = application
    ? profiles.find((profile) => profile.id === application.creatorId)
    : undefined

  const displayedActivities =
    showMore || expanded ? activities : activities.slice(0, 3)
  const hasMoreActivities = activities.length > 3

  const content = (
    <div className={`space-y-4 ${expanded ? "" : "p-3"}`}>
      <ul className="relative flex flex-col gap-y-5 text-[12.75px] text-gray-500 before:absolute before:top-0 before:bottom-0 before:left-[5px] before:z-0 before:w-[1px] before:bg-gray-200/70">
        {/* Dynamic activities */}
        {displayedActivities.map((activity) => {
          const { id, createdAt } = activity

          const render = (() => {
            switch (activity.type) {
              case GetActivities200ResponseInnerTypeEnum.AttributeUpdate: {
                const metadata = activity.metadata as {
                  attributeName: string
                  sourceName: string
                }
                const { value: previousValue } = activity.previousValue as {
                  value?: string
                }
                const { value } = activity.newValue as { value: string }

                return (
                  <>
                    <div className="flex-1">
                      <TimeDisplay time={createdAt} />

                      <div className="ml-5 text-sm">
                        <span className="text-gray-500">
                          {metadata.sourceName}
                        </span>{" "}
                        {previousValue
                          ? value
                            ? `changed ${metadata.attributeName.toLowerCase()} to ${value}`
                            : `cleared ${metadata.attributeName.toLowerCase()}`
                          : value
                            ? `set ${metadata.attributeName.toLowerCase()} to ${value}`
                            : `reset ${metadata.attributeName.toLowerCase()}`}
                      </div>
                    </div>
                  </>
                )
              }

              case GetActivities200ResponseInnerTypeEnum.ReviewCreated:
              case GetActivities200ResponseInnerTypeEnum.ReviewUpdated: {
                const { status } = activity.newValue ?? {}

                const { authorName } = activity.metadata as {
                  authorName: string
                }
                const causedBy = activity.sourceEntity as Review | undefined
                const responses = (
                  Array.isArray(causedBy?.responses)
                    ? causedBy?.responses
                    : // @ts-ignore
                      causedBy?.responses?.responses
                ) as FormResponse[] | undefined

                if (
                  status !== "Approved" &&
                  status !== "Rejected" &&
                  !responses
                )
                  return null
                return (
                  <>
                    <div className="flex-1">
                      <TimeDisplay time={createdAt} />

                      <div className="mb-1 ml-5 text-sm">
                        <span className="text-gray-500">{authorName}</span>{" "}
                        added a review
                      </div>
                      {causedBy ? (
                        <div className="ml-5 space-y-2 overflow-hidden rounded-md border border-gray-200 p-1.5 px-2 text-[13px] shadow-sm">
                          {responses?.map((response) => {
                            return (
                              <div key={response.id} className="">
                                <div className="text-gray-500 text-xs">
                                  {response.question}
                                </div>
                                <div className="text-gray-600 text-sm">
                                  {String(response.answer)}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  </>
                )
              }

              case GetActivities200ResponseInnerTypeEnum.ApplicationStatusUpdate: {
                const metadata = activity.metadata as {
                  attributeName: string
                  sourceName: string
                }
                const { value: previousValue } = activity.previousValue as {
                  value?: string
                }
                const { value } = activity.newValue as { value: string }

                return (
                  <>
                    <div className="flex-1">
                      <TimeDisplay time={createdAt} />

                      <div className="ml-5 text-sm ">
                        <span className="text-gray-500">
                          {metadata.sourceName}
                        </span>{" "}
                        {previousValue
                          ? value
                            ? `changed status to ${value}`
                            : "cleared status"
                          : value
                            ? `set status to ${value}`
                            : "reset status"}
                      </div>
                    </div>
                  </>
                )
              }

              case GetActivities200ResponseInnerTypeEnum.MessageSent: {
                const { authorName } = activity.metadata as {
                  authorName: string
                }
                const causedBy = activity.sourceEntity as Message | undefined

                return (
                  <>
                    <div className="flex-1">
                      <TimeDisplay time={createdAt} />

                      <div className="mb-1 ml-5 text-sm ">
                        <span className="text-gray-500">{authorName} </span>{" "}
                        left a note
                      </div>
                      {causedBy ? (
                        <div
                          className="ml-5 overflow-hidden rounded-md border border-gray-200 p-1.5 px-2 text-[13px] shadow-sm"
                          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                          dangerouslySetInnerHTML={{ __html: causedBy.content }}
                        />
                      ) : null}
                    </div>
                  </>
                )
              }

              case GetActivities200ResponseInnerTypeEnum.EmailSent:
              case GetActivities200ResponseInnerTypeEnum.EmailReceived: {
                const { source } = activity
                const { to, authorName, from, emailTitle } = activity.metadata
                const causedBy = activity.sourceEntity as Message | undefined

                return (
                  <>
                    <div className="flex-1">
                      <TimeDisplay time={createdAt} />

                      <div className="mb-1 ml-5 text-sm ">
                        {source ===
                        GetActivities200ResponseInnerSourceEnum.Workflow
                          ? `Workflow sent ${emailTitle ? `"${emailTitle}" email` : "an email"}`
                          : activity.type === activityTypeEnum.EmailSent
                            ? `${authorName} sent an email`
                            : `${to[0].name} received email from ${from.name}`}
                      </div>
                      {causedBy ? (
                        <div
                          className="ml-5 space-y-3 overflow-hidden rounded-md border border-gray-200 p-1.5 px-2 text-[13px] shadow-sm"
                          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                          dangerouslySetInnerHTML={{
                            __html: causedBy.content,
                          }}
                        />
                      ) : null}
                    </div>
                  </>
                )
              }

              default:
                return <></>
            }
          })()

          return (
            <li key={id} className="relative ">
              {render}
            </li>
          )
        })}

        {/* Creation activity - always shown first */}
        {application ? (
          <li className="relative text-gray-500">
            <TimeDisplay time={application.createdAt} />
            <div className="ml-5 text-sm ">
              {creator ? (
                <>
                  <span className="text-gray-500">{creator.displayName}</span>{" "}
                  created application
                </>
              ) : (
                <>
                  <span className="text-gray-500">
                    {application.candidate.firstName}{" "}
                  </span>{" "}
                  submitted application
                </>
              )}
            </div>
          </li>
        ) : null}
      </ul>
    </div>
  )

  return expanded ? (
    content
  ) : (
    <Card title="Activity">
      {content}
      <Button
        variant="plain"
        className="flex w-full items-center justify-center gap-x-2 rounded-none border-neutral-100 border-t py-1 text-slate-400 text-sm"
        onPress={() => onExpand?.()}
      >
        <span>Activity</span>
        <ArrowRight />
      </Button>
    </Card>
  )
}

export default ActivityCard
