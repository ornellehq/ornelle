import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import dayjs from "dayjs"
import { type KeyboardEvent, useState } from "react"
import {
  GetEmailTemplates200ResponseInnerTypeEnum,
  type ResponseError,
} from "sdks/src/server-sdk"
import { toast } from "sonner"
import Trash from "webui-library/src/icons/Trash"
import EditInline from "webui-library/src/icons/edit-inline"
import Copy from "webui-library/src/icons/huge-icons/copy-01"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { WorkspaceItem } from "~/core/workspace/components/workspace-item"
import { useWorkspaceParams } from "~/core/workspace/navigation"
import { useWorkspaceContext } from "~/core/workspace/workspace.context"
import TopBar from "~/routes/(workspace)/-components/top-bar"

export const Route = createFileRoute(
  "/(workspace)/w/$code/_layout/email-templates/",
)({
  component: EmailTemplates,
})

function EmailTemplates() {
  const api = useWorkspaceApi()
  const { code } = useWorkspaceParams()
  const [renamingTemplateId, setRenamingTemplateId] = useState<string | null>(
    null,
  )
  const { setAppState } = useWorkspaceContext()

  // Fetch email templates
  const queryKey = [api.emailTemplate.getEmailTemplates.name]
  const { data: emailTemplates = [] } = useQuery({
    queryKey,
    queryFn: () => api.emailTemplate.getEmailTemplates(),
  })

  // Handle renaming template
  const handleStartRename = (templateId: string) => {
    setRenamingTemplateId(templateId)
  }

  const handleCancelRename = () => {
    setRenamingTemplateId(null)
  }

  const handleSubmitRename: React.FocusEventHandler<HTMLInputElement> = async (
    ev,
  ) => {
    const value = ev.target.value.trim()
    const templateId = renamingTemplateId
    const prevName = emailTemplates?.find(
      (template) => template.id === templateId,
    )?.name

    if (!templateId || !value || prevName === value) {
      handleCancelRename()
      return
    }

    try {
      await api.emailTemplate.updateEmailTemplate({
        id: templateId,
        updateEmailTemplateRequest: {
          name: value,
        },
      })

      await queryClient.invalidateQueries({ queryKey })
      handleCancelRename()
    } catch (error) {
      console.error("Failed to rename email template:", error)
      handleCancelRename()
    }
  }

  const handleRenameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmitRename(e)
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancelRename()
    }
  }

  // Handle duplicating template
  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      const templateToDuplicate = emailTemplates?.find(
        (template) => template.id === templateId,
      )
      if (!templateToDuplicate) return

      await api.emailTemplate.createEmailTemplate({
        createEmailTemplateRequest: {
          name: `${templateToDuplicate.name} (Copy)`,
          description: templateToDuplicate.description || "",
          content: templateToDuplicate.content,
          subject: templateToDuplicate.subject,
          emailType: templateToDuplicate.type,
        },
      })

      await queryClient.invalidateQueries({ queryKey })
    } catch (error) {
      console.error("Failed to duplicate email template:", error)
    }
  }

  // Handle deleting template
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.emailTemplate.deleteEmailTemplate({ id })
    },
    onError: async (_) => {
      const error = _ as Error | ResponseError
      if ("response" in error) {
        const json = await error.response.json()
        toast.error(json.message)
      } else {
        toast.error(error?.message ?? "An error occurred. Please try again.")
      }
    },
    onSuccess: async () => {
      setAppState((state) => ({
        ...state,
        confirmationModal: null,
      }))
      await queryClient.invalidateQueries({ queryKey })
    },
  })

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      setAppState((state) => {
        return {
          ...state,
          confirmationModal: {
            title: "Delete Email Template",
            description: "Are you sure you want to delete this email template?",
            confirmButton: {
              children: "Delete",
              onClick: async () => {
                await deleteTemplateMutation.mutate(templateId)
              },
            },
          },
        }
      })
    } catch (error) {
      console.error("Failed to delete email template:", error)
    }
  }
  const typeToLabelMap = {
    [GetEmailTemplates200ResponseInnerTypeEnum.Application]: "Application",
    [GetEmailTemplates200ResponseInnerTypeEnum.MeetingRequest]:
      "Meeting Request",
  }

  return (
    <>
      <TopBar
        breadCrumbs={[
          {
            id: "email-templates",
            children: "Email Templates",
          },
        ]}
      />
      <div className="flex-1 overflow-y-auto bg-white">
        <ul className="flex flex-col gap-y-1 bg-gray-100 py-1">
          {emailTemplates.map((template) => {
            const { id, name, description, createdAt } = template

            // Define menu items for the template
            const menuItems = [
              {
                id: "rename",
                Icon: EditInline,
                children: "Rename",
                onAction: () => handleStartRename(id),
              },
              {
                id: "duplicate",
                Icon: Copy,
                children: "Duplicate",
                onAction: () => handleDuplicateTemplate(id),
              },
              {
                id: "delete",
                Icon: Trash,
                children: "Delete",
                onAction: () => handleDeleteTemplate(id),
              },
            ]

            // Define top row items (metadata with bullet separators)
            const topRowItems = [
              // {
              //   id: "description",
              //   content: description || "No description",
              // },
              {
                id: "type",
                content: typeToLabelMap[template.type],
              },
              {
                id: "updated",
                content: `Updated ${dayjs(template.updatedAt).fromNow()}`,
              },
            ]

            return (
              <WorkspaceItem
                key={id}
                id={id}
                name={name}
                isRenaming={renamingTemplateId === id}
                linkTo=""
                linkSearch={{
                  drw: {
                    id: "et",
                    e: id,
                  },
                }}
                linkParams={{
                  code,
                }}
                menuItems={menuItems}
                topRowItems={topRowItems}
                onRenameStart={handleStartRename}
                onRenameSubmit={handleSubmitRename}
                onRenameKeyDown={handleRenameKeyDown}
              />
            )
          })}
        </ul>
      </div>
    </>
  )
}
