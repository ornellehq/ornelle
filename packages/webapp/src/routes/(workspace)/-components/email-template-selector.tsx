import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "webui-library/src/button"
import DialogTrigger from "webui-library/src/dialog-trigger"
import Search from "webui-library/src/icons/search"
import ListBox from "webui-library/src/list-box"
import ListBoxItem from "webui-library/src/list-box-item"
import Popover from "webui-library/src/popover"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import ModalRenderer from "~/routes/(workspace)/-components/modal-renderer"
import type { CreateEmailTemplateProps } from "~/routes/(workspace)/-components/modals/create-email-template"

export interface EmailTemplateSelectorProps {
  onSelectTemplate: (templateContent: string) => void
  className?: string
  /**
   * When true, only shows a button to select templates.
   * When false (default), shows the full search interface.
   */
  compact?: boolean
  button: React.ComponentProps<typeof Button>
}

const EmailTemplateSelector = ({
  onSelectTemplate,
  className = "",
  compact = false,
  button,
}: EmailTemplateSelectorProps) => {
  const api = useWorkspaceApi()
  const [modalOpened, setModalOpened] = useState(false)
  const [popoverOpened, setPopoverOpened] = useState(false)
  const queryKey = [api.emailTemplate.getEmailTemplates.name]

  const { data: emailTemplates = [], isPending } = useQuery({
    queryKey,
    queryFn: async () => {
      return api.emailTemplate.getEmailTemplates()
    },
  })

  const close = () => setModalOpened(false)

  const handleSelectTemplate = async (id: string) => {
    const template = emailTemplates.find((template) => template.id === id)
    if (template) {
      onSelectTemplate(template.content.html)
    }
    setPopoverOpened(false)
  }

  // Return the compact button version when compact=true
  if (compact) {
    return (
      <>
        <DialogTrigger>
          <Button
            type="button"
            variant="plain"
            onPress={() => setPopoverOpened(true)}
            {...button}
          />
          <Popover
            isOpen={popoverOpened}
            onOpenChange={setPopoverOpened}
            placement="bottom left"
            className="max-h-72 w-[338px] overflow-y-auto p-1"
          >
            {isPending ? (
              <div className="p-3 text-center text-gray-500">
                Loading templates...
              </div>
            ) : emailTemplates.length > 0 ? (
              <>
                <ListBox
                  onAction={(key) => {
                    handleSelectTemplate(key as string)
                  }}
                >
                  {emailTemplates.map((template) => {
                    return (
                      <ListBoxItem
                        key={template.id}
                        id={template.id}
                        className="flex h-8 items-center gap-x-2 rounded-md px-2 leading-8 outline-none hover:bg-slate-50 focus:bg-slate-50"
                      >
                        {template.name}
                      </ListBoxItem>
                    )
                  })}
                </ListBox>
                <div className="border-gray-100 border-t p-2 text-center text-gray-500 text-xs">
                  <Button
                    variant="plain"
                    className="text-gray-600 text-xs underline"
                    onPress={() => {
                      setModalOpened(true)
                      setPopoverOpened(false)
                    }}
                  >
                    Create new template
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-3 text-center text-gray-500">
                <p className="mb-2">No templates found</p>
                <Button
                  variant="plain"
                  className="text-gray-600 underline"
                  onPress={() => {
                    setModalOpened(true)
                    setPopoverOpened(false)
                  }}
                >
                  Create template
                </Button>
              </div>
            )}
          </Popover>
        </DialogTrigger>
        {modalOpened ? (
          <ModalRenderer
            modal={{ id: "cr8et" }}
            close={close}
            componentProps={
              {
                onSuccess: async (data) => {
                  close()
                  await queryClient.invalidateQueries({ queryKey })
                  onSelectTemplate(data.content)
                },
              } as CreateEmailTemplateProps
            }
          />
        ) : null}
      </>
    )
  }

  // Return the full interface when compact=false
  return (
    <>
      <div className={`flex flex-col ${className}`}>
        {isPending ? null : (
          <>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
              {emailTemplates.length > 0 ? (
                <>
                  <DialogTrigger>
                    <div className="relative flex items-center">
                      <Button className="sr-only h-8" variant="plain" />
                      <TextFieldInput
                        onClick={() => setPopoverOpened(true)}
                        className="flex-1 pl-8 [--spacing-9:2rem]"
                        placeholder="Search email templates..."
                      />
                      <Search
                        width={14}
                        className="absolute left-2 text-gray-500"
                      />
                    </div>
                    <Popover
                      isOpen={popoverOpened}
                      onOpenChange={setPopoverOpened}
                      placement="bottom left"
                      className="max-h-72 w-[338px] overflow-y-auto"
                    >
                      <ListBox
                        onAction={(key) => {
                          handleSelectTemplate(key as string)
                        }}
                      >
                        {emailTemplates.map((template) => (
                          <ListBoxItem
                            key={template.id}
                            id={template.id}
                            className="flex h-8 items-center gap-x-2 rounded-md px-2 leading-8 outline-none hover:bg-slate-50 focus:bg-slate-50"
                          >
                            {template.name}
                          </ListBoxItem>
                        ))}
                      </ListBox>
                    </Popover>
                  </DialogTrigger>
                  <div className="mt-3 text-center text-gray-500">
                    <Button
                      variant="plain"
                      className="text-gray-600 underline"
                      onPress={() => {
                        setPopoverOpened(true)
                      }}
                    >
                      Select
                    </Button>{" "}
                    or{" "}
                    <Button
                      variant="plain"
                      className="text-gray-600 underline"
                      onPress={() => {
                        setModalOpened(true)
                      }}
                    >
                      create
                    </Button>{" "}
                    a saved email
                  </div>
                </>
              ) : (
                <div className="flex justify-center">
                  <Button
                    variant="plain"
                    className="underline"
                    onPress={() => {
                      setModalOpened(true)
                    }}
                  >
                    Add email content
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {modalOpened ? (
        <ModalRenderer
          modal={{ id: "cr8et" }}
          close={close}
          componentProps={
            {
              onSuccess: async (data) => {
                close()
                await queryClient.invalidateQueries({ queryKey })
                onSelectTemplate(data.content)
              },
            } as CreateEmailTemplateProps
          }
        />
      ) : null}
    </>
  )
}

export default EmailTemplateSelector
