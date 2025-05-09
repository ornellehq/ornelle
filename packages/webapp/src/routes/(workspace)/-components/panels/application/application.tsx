import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import dayjs from "dayjs"
import { useState } from "react"
import { type FieldValues, useForm } from "react-hook-form"
import { Sheet } from "react-modal-sheet"
import {
  type CreateApplication200Response,
  GetEmailTemplates200ResponseInnerTypeEnum,
} from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import CaretDown from "webui-library/src/icons/CaretDown"
import CheckMarkInSquare2 from "webui-library/src/icons/CheckMarkInSquare2"
import ThreeDotsHorizontal from "webui-library/src/icons/ThreeDotsHorizontal"
import X from "webui-library/src/icons/X"
import Check from "webui-library/src/icons/check"
import ArrowDown02 from "webui-library/src/icons/huge-icons/arrow-down-02"
import ArrowUp02 from "webui-library/src/icons/huge-icons/arrow-up-02"
import DocumentAttachment from "webui-library/src/icons/huge-icons/document-attachment"
import Message01 from "webui-library/src/icons/message-01"
import PaperPlaneTilt from "webui-library/src/icons/phosphor/paper-plane-tilt"
import Modal from "webui-library/src/modal"
import ModalOverlay from "webui-library/src/modal-overlay"
import { cn } from "webui-library/src/utils/cn"
import Menu from "webui-library/src/widgets/menu"
import { queryClient } from "~/core/network"
import { useFilesBaseUrl } from "~/core/user/hooks"
import { useWorkspaceApi } from "~/core/workspace/api"
import {
  useApplication,
  useApplicationStatuses,
} from "~/core/workspace/applications/hooks"
import { useSyncEntityForm } from "~/core/workspace/entities/hooks"
import Save from "~/routes/-components/save/save"
import EntityLayout from "../components/entity-layout"
import { PanelHeaderLeftSlot } from "../slot"
import ViewTabs from "../view-tabs"
import ActivityCard from "./-components/activity-card"
import LeaveANote from "./leave-a-note"
import Review from "./review"
import SendEmail from "./send-email"

type View = "Activity"
const ApplicationWithData = ({
  application,
}: {
  application: CreateApplication200Response
}) => {
  const filesBaseUrl = useFilesBaseUrl()
  const { id, candidate, createdAt, resumeData } = application

  const api = useWorkspaceApi()
  const {
    data: applicationStatuses = [],
    status: applicationStatusesQueryStatus,
  } = useApplicationStatuses()
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [showAllAttributes, setShowAllAttributes] = useState(true)
  const [view, setView] = useState<View>("Activity")
  const [emailMenuState, setEmailMenuState] = useState<"main" | "templates">(
    "main",
  )
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  )
  const [showPdfPreview, setShowPdfPreview] = useState<string | null>(null)
  const [currentReviewId] = useState<string | null>(null)
  const form = useForm<FieldValues>({
    defaultValues: {
      ...application,
      "candidate.name": `${candidate.firstName} ${candidate.lastName}`,
      createdAt: dayjs(createdAt).format("MMMM DD, YYYY h:m A"),
      ...(Array.isArray(resumeData)
        ? Object.fromEntries(
            resumeData.map(({ name, value }) => [`resume_${name}`, value]),
          )
        : {}),
    },
  })

  useSyncEntityForm({ form, data: application })
  const activitiesQueryKey = [api.activity.getActivities.name, application.id]

  // Fetch email templates
  const { data: emailTemplates = [], status: emailTemplatesStatus } = useQuery({
    queryKey: [api.emailTemplate.getEmailTemplates.name],
    queryFn: async () => api.emailTemplate.getEmailTemplates(),
  })

  const closeActiveAction = () => {
    setActiveAction(null)
  }

  const handleCardExpand = (cardId: string) => {
    setExpandedCard(cardId === expandedCard ? null : cardId)
  }

  const actionButtons = [
    {
      id: "email",
      label: "Email",
      icon: <PaperPlaneTilt width={14} className="text-gray-500" />,
      isMenu: true,
      action: () => {}, // Handled by the menu items
    },
    {
      id: "comment",
      label: "Comment",
      icon: <Message01 width={14} className="text-gray-500" />,
      action: () =>
        setActiveAction(activeAction === "comment" ? null : "comment"),
    },
  ]

  const menuItems = [
    {
      id: "review",
      children: (
        <>
          <CheckMarkInSquare2 width={14} className="text-gray-500" />
          <span>Review</span>
        </>
      ),
      // icon: <CheckMarkInSquare2 width={14} className="text-gray-500" />,
      onAction: () =>
        setActiveAction(activeAction === "review" ? null : "review"),
    },
  ]

  const handleStatusChange = async (statusId: string) => {
    try {
      await api.application.updateApplication({
        id: application.id,
        updateApplicationRequest: {
          statusId,
        },
      })

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [api.application.getApplication.name, application.id],
        }),
        queryClient.invalidateQueries({
          queryKey: [api.application.getApplications.name],
        }),
        queryClient.invalidateQueries({
          queryKey: activitiesQueryKey,
        }),
      ])
    } catch (error) {
      console.error("Failed to update application status:", error)
    }
  }

  const handleActionSuccess = async () => {
    closeActiveAction()
    await queryClient.invalidateQueries({ queryKey: activitiesQueryKey })
  }

  return (
    <>
      <EntityLayout
        id={id}
        entityType="Application"
        form={form}
        showAddAttribute={false}
        showCustomAttributes={showAllAttributes}
        title={
          <>
            <h2 className="px-6 text-lg">
              Application {application.numberInWorkspace}
            </h2>
          </>
        }
        builtInAttributes={[
          // {
          //   id: "numberInWorkspace",
          //   name: "Application",
          //   editable: false,
          //   dataType: "Text",
          //   type: "system",
          //   // value: application.numberInWorkspace,
          //   field: {
          //     type: "Text",
          //     options: {},
          //   },
          // },
          {
            id: "createdAt",
            name: "Created",
            editable: false,
            type: "system" as const,
            dataType: "Text" as const,
            field: {
              type: "Text" as const,
              options: {},
            },
            value: dayjs(createdAt).format("MMMM DD, YYYY h:m A"),
          },
          {
            id: "candidate.name",
            name: "Candidate",
            editable: false,
            dataType: "Text",
            type: "system",
            // value: `${candidate.firstName} ${candidate.lastName}`,
            field: {
              type: "Text",
              options: {},
            },
          },
          {
            id: "candidate.email",
            name: "Email",
            dataType: "Text",
            editable: false,
            type: "system",
            // value: candidate.email,
            field: {
              type: "Email",
            },
          },
          {
            id: "statusId",
            name: "Status",
            dataType: "Select",
            editable: true,
            type: "system",
            // value: candidate.email,
            field: {
              type: "Select",
              options: {
                items: applicationStatuses.map(({ id, name }) => ({
                  name,
                  id,
                })),
              },
            },
            transform: (value) => {
              return (
                applicationStatuses.find((status) => status.id === value)
                  ?.name ?? null
              )
            },
          },
          {
            id: "resources",
            name: "Documents",
            dataType: "Text",
            editable: false,
            type: "system",
            plain: true,
            transform: (value) => {
              return (
                <div className="flex items-center gap-x-2">
                  {application.resumeLink ? (
                    <Button
                      variant="plain"
                      className="flex items-center gap-x-1"
                      onPress={() =>
                        setShowPdfPreview(
                          `${filesBaseUrl}${application.resumeLink}`,
                        )
                      }
                    >
                      <DocumentAttachment width={14} /> <span>Resume</span>
                    </Button>
                  ) : null}
                </div>
              )
            },
            // value: candidate.email,
            field: {
              type: "URL",
            },
          },
        ]}
      >
        <div className={"mx-6 mb-4 flex items-center"}>
          {!expandedCard ? (
            <Button
              variant="plain"
              className="inline-flex items-center text-gray-600 text-xs"
              onClick={() => setShowAllAttributes(!showAllAttributes)}
            >
              {showAllAttributes ? "Hide" : "Show"} more details{" "}
              <CaretDown
                width={14}
                className={`ml-1 transform ${
                  showAllAttributes ? "-rotate-180" : ""
                }`}
              />
            </Button>
          ) : null}
        </div>

        <>
          <div className="mt-2 border-gray-200/70 border-t px-6 pt-7">
            <div className="mb-5 flex">
              <ViewTabs
                view={view}
                setView={setView}
                tabs={[
                  { id: "Activity", children: "Activity" },
                  // { id: "Assistant", children: "Assistant" },
                ]}
              />
            </div>
            {view === "Activity" ? (
              <ActivityCard
                application={application}
                onAddComment={() => setActiveAction("comment")}
                expanded={true}
                onExpand={() => handleCardExpand("activity")}
              />
            ) : null}
          </div>
        </>
      </EntityLayout>
      {!expandedCard ? (
        <div className="mx-3 flex flex-wrap items-center divide-x border-gray-100 border-t py-4 text-[13px]">
          {/* shadow-[0px_-1px_24px_rgba(0,0,0,0.035)] */}
          <div className="mx-2 flex h-6 items-center rounded-md *:h-6 *:px-2">
            <Menu
              triggerButton={{
                className: "text-red-500",
                children: <X />,
              }}
              items={applicationStatuses
                .filter((status) => status.category === "Rejected")
                .map((status) => ({ id: status.id, children: status.name }))}
              onAction={(id) => {
                handleStatusChange(id as string)
              }}
            />
            <Menu
              triggerButton={{
                className: "text-blue-500",
                children: <Check />,
              }}
              items={applicationStatuses
                .filter((status) => status.category === "Started")
                .map((status) => ({ id: status.id, children: status.name }))}
              onAction={(id) => {
                handleStatusChange(id as string)
              }}
            />
          </div>
          {actionButtons.map((button) =>
            button.isMenu ? (
              <Menu
                key={button.id}
                triggerButton={{
                  className:
                    "flex items-center gap-1 px-3 leading-6 h-6 bg-white rounded-none text-gray-700 hover:bg-gray-50",
                  children: (
                    <>
                      {button.icon}
                      {button.label}
                      <CaretDown width={12} />
                    </>
                  ),
                }}
                items={
                  button.id === "change-status"
                    ? applicationStatuses.map((status) => ({
                        id: status.id,
                        children: (
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full border"
                              style={{
                                borderColor: status.color || "#cbd5e1",
                              }}
                            />
                            {status.name}
                          </span>
                        ),
                      }))
                    : button.id === "email"
                      ? emailMenuState === "main"
                        ? [
                            {
                              id: "choose-template",
                              children: (
                                <span className="flex items-center gap-2">
                                  Choose a template
                                </span>
                              ),
                            },
                            {
                              id: "blank",
                              children: (
                                <span className="flex items-center gap-2">
                                  Blank email
                                </span>
                              ),
                            },
                          ]
                        : emailTemplatesStatus === "pending"
                          ? [
                              {
                                id: "loading",
                                children: "Loading templates...",
                              },
                            ]
                          : emailTemplates
                              .filter(
                                (template) =>
                                  template.type ===
                                  GetEmailTemplates200ResponseInnerTypeEnum.Application,
                              )
                              .map((template) => ({
                                id: `template-${template.id}`,
                                children: template.name,
                              }))
                      : emailTemplatesStatus === "pending"
                        ? [
                            {
                              id: "loading",
                              children: "Loading templates...",
                            },
                          ]
                        : [
                            ...emailTemplates
                              .filter(
                                (template) =>
                                  template.type ===
                                  GetEmailTemplates200ResponseInnerTypeEnum.MeetingRequest,
                              )
                              .map((template) => ({
                                id: `${template.id}`,
                                children: template.name,
                              })),
                            {
                              id: "blank",
                              children: <span className="">Blank</span>,
                            },
                          ]
                }
                onAction={(key) => {
                  const keyStr = key as string
                  if (button.id === "change-status") {
                    handleStatusChange(keyStr)
                  } else if (button.id === "email") {
                    if (emailMenuState === "main") {
                      if (keyStr === "choose-template") {
                        setEmailMenuState("templates")
                      } else if (keyStr === "blank") {
                        setActiveAction("email")
                        setSelectedTemplateId(null)
                      }
                    } else {
                      // Handle template selection
                      if (keyStr.startsWith("template-")) {
                        const templateId = keyStr.replace("template-", "")
                        const selectedTemplate = emailTemplates.find(
                          (t) => t.id === templateId,
                        )
                        if (selectedTemplate) {
                          setActiveAction("email")
                          setSelectedTemplateId(templateId)
                        }
                      }
                      // Reset menu state
                      setEmailMenuState("main")
                    }
                  }
                }}
                popover={{
                  className: "max-h-[30rem] overflow-y-auto",
                  isOpen:
                    (button.id === "email" && emailMenuState === "templates") ||
                    undefined,
                  onOpenChange: (open) => {
                    if (!open) {
                      setEmailMenuState("main")
                    }
                  },
                }}
              />
            ) : (
              <Button
                key={button.id}
                variant="plain"
                className={
                  "flex h-6 items-center gap-1 rounded-none px-3 leading-6"
                }
                onClick={button.action}
              >
                {button.icon}
                {button.label}
              </Button>
            ),
          )}

          {/* Three Dots Menu */}
          <div className="">
            <Menu
              triggerButton={{
                className:
                  "flex items-center gap-1 px-3 leading-6 h-6 bg-white rounded-none text-sm text-gray-700 hover:bg-gray-50",
                children: <ThreeDotsHorizontal width={16} />,
              }}
              items={menuItems}
              onAction={(key) => {}}
            />
          </div>
        </div>
      ) : null}
      <Sheet
        isOpen={!!activeAction}
        onClose={closeActiveAction}
        // rootId="panel-container"
        mountPoint={document.getElementById("application-panel-container")}
        snapPoints={
          activeAction === "comment" ? [400] : activeAction ? [0.5] : []
        }
        initialSnap={0}
        style={{
          boxShadow: "none",
        }}
      >
        <Sheet.Container className="mx-2 w-[calc(100%-1rem)!important]">
          <Sheet.Header className="h-6" style={{ height: "1.5rem" }}>
            {/* <div className="py-2">Header</div> */}
          </Sheet.Header>
          <Sheet.Content className="">
            {/* Inline Action Components */}
            {activeAction && !expandedCard ? (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-gray-100/0 border-b p-2 px-6 py-1 pt-1 pb-3 leading-8">
                  <Button
                    variant="plain"
                    className="text-gray-500"
                    onPress={closeActiveAction}
                  >
                    <X width={16} />
                  </Button>
                  <h3 className="text-center text-sm">
                    {activeAction === "email"
                      ? "Send Email"
                      : activeAction === "review"
                        ? "Review Application"
                        : activeAction === "decide"
                          ? "Decide"
                          : "Leave a Comment"}
                  </h3>
                  <span className="w-3" />
                </div>
                <div className="flex-1 overflow-hidden">
                  {activeAction === "email" ? (
                    <SendEmail
                      key={selectedTemplateId ?? "blank"}
                      application={application}
                      template={emailTemplates.find(
                        ({ id }) => id === selectedTemplateId,
                      )}
                      onSuccess={handleActionSuccess}
                      close={closeActiveAction}
                    />
                  ) : activeAction === "review" ? (
                    <Review
                      applicationId={id}
                      onSuccess={handleActionSuccess}
                      reviewId={currentReviewId}
                      // onSuccess={(activity) => {
                      //   queryClient.invalidateQueries({
                      //     queryKey: activitiesQueryKey,
                      //   })
                      //   closeActiveAction()
                      // }}
                      close={closeActiveAction}
                    />
                  ) : activeAction === "comment" ? (
                    <LeaveANote
                      entityId={id}
                      onSuccess={handleActionSuccess}
                      close={closeActiveAction}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
          </Sheet.Content>
        </Sheet.Container>
        {/* <Sheet.Backdrop /> */}
      </Sheet>
      <ModalOverlay
        isDismissable
        isKeyboardDismissDisabled
        isOpen={showPdfPreview !== null}
        onOpenChange={() => setShowPdfPreview(null)}
        className={cn(
          "fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-5",
        )}
      >
        <Modal
          isOpen={showPdfPreview !== null}
          className="h-4/6 w-full max-w-5xl rounded-2xl bg-white p-10 shadow-2xl"
        >
          <embed
            src={showPdfPreview}
            type="application/pdf"
            className="h-full w-full"
          />
        </Modal>
      </ModalOverlay>
    </>
  )
}

const Application = ({ id }: { id: string }) => {
  const api = useWorkspaceApi()
  const navigate = useNavigate()

  const { data: application, isLoading } = useApplication({ id })

  if (isLoading || !application) {
    return <div className="3xl:w-[36rem] w-[28rem] 2xl:w-[32rem]" />
  }

  const handlePrevious = () => {
    if (application._previousId) {
      navigate({
        to: ".",
        search: { drw: { id: "ap", e: application._previousId } },
      })
    }
  }

  const handleNext = () => {
    if (application._nextId) {
      navigate({
        to: ".",
        search: { drw: { id: "ap", e: application._nextId } },
      })
    }
  }

  return (
    <div
      id="application-panel-container"
      className="flex flex-1 translate-x-0 transform flex-col overflow-auto"
    >
      <PanelHeaderLeftSlot>
        <div className="flex items-center gap-x-2 text-gray-600">
          <div className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-200">
            <Save
              entityType="Application"
              entityId={id}
              name={`Application ${application.numberInWorkspace}`}
            />
          </div>
          <Button
            variant="plain"
            isDisabled={!application._previousId}
            onPress={handlePrevious}
            aria-label="Previous application"
            className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-200"
          >
            <ArrowDown02 width={12} className="" />
          </Button>
          <Button
            variant="plain"
            isDisabled={!application._nextId}
            onPress={handleNext}
            aria-label="Next application"
            className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-200"
          >
            <ArrowUp02 width={12} className="" />
          </Button>
          {/* <Button variant="plain" className="flex items-center gap-x-1">
                  <ThreeDotsHorizontal width={14} />
                </Button> */}
        </div>
      </PanelHeaderLeftSlot>
      <ApplicationWithData application={application} />
    </div>
  )
}

export default Application
