import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import dayjs from "dayjs"
import { type KeyboardEvent, useState } from "react"
import {
  type CreateFormRequestTypeEnum,
  GetForms200ResponseInnerTypeEnum,
  type ResponseError,
  UpdateFormRequestOpeningsInnerOperationEnum,
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
import OpeningsSelector from "~/routes/(workspace)/-components/openings-selector"
import TopBar from "~/routes/(workspace)/-components/top-bar"

export const Route = createFileRoute("/(workspace)/w/$code/_layout/forms/")({
  component: Forms,
})

function Forms() {
  const api = useWorkspaceApi()
  const { code } = useWorkspaceParams()
  const [renamingFormId, setRenamingFormId] = useState<string | null>(null)
  const { setAppState } = useWorkspaceContext()

  // Fetch forms and openings
  const queryKey = [api.form.getForms.name]
  const { data: forms } = useQuery({
    queryKey,
    queryFn: () => {
      return api.form.getForms()
    },
  })

  // Handle renaming form
  const handleStartRename = (formId: string) => {
    setRenamingFormId(formId)
  }

  const handleCancelRename = () => {
    setRenamingFormId(null)
  }

  const handleSubmitRename: React.FocusEventHandler<HTMLInputElement> = async (
    ev,
  ) => {
    const value = ev.target.value.trim()
    const formId = renamingFormId
    const prevName = forms?.find((form) => form.id === formId)?.name

    if (!formId || !value || prevName === value) {
      handleCancelRename()
      return
    }

    try {
      await api.form.updateForm({
        id: formId,
        updateFormRequest: {
          title: value,
        },
      })

      await queryClient.invalidateQueries({ queryKey })
      handleCancelRename()
    } catch (error) {
      console.error("Failed to rename form:", error)
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

  // Handle duplicating form
  const handleDuplicateForm = async (formId: string) => {
    try {
      const formToDuplicate = forms?.find((form) => form.id === formId)
      if (!formToDuplicate) return

      await api.form.createForm({
        createFormRequest: {
          title: `${formToDuplicate.name} (Copy)`,
          type: formToDuplicate.type as unknown as CreateFormRequestTypeEnum,
          fields: formToDuplicate.content.json,
          // Copy other properties as needed
        },
      })

      await queryClient.invalidateQueries({ queryKey })
    } catch (error) {
      console.error("Failed to duplicate form:", error)
    }
  }

  const deleteFormMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.form.deleteForm({ id })
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
  // Handle deleting form
  const handleDeleteForm = async (formId: string) => {
    try {
      setAppState((state) => {
        return {
          ...state,
          confirmationModal: {
            title: "Delete Form",
            description: "Are you sure you want to delete this form?",
            confirmButton: {
              children: "Delete",
              onClick: async () => {
                await deleteFormMutation.mutate(formId)
              },
            },
          },
        }
      })
    } catch (error) {
      console.error("Failed to delete form:", error)
    }
  }

  // Handle opening selection change
  const handleOpeningSelectionChange = async (
    formId: string,
    openingId: string,
    selected: boolean,
  ) => {
    try {
      await api.form.updateForm({
        id: formId,
        updateFormRequest: {
          openings: [
            {
              operation: selected
                ? UpdateFormRequestOpeningsInnerOperationEnum.Connect
                : UpdateFormRequestOpeningsInnerOperationEnum.Disconnect,
              id: openingId,
            },
          ],
        },
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({
          queryKey: [api.opening.getOpenings.name],
        }),
      ])

      return true
    } catch (error) {
      console.error("Failed to update form openings:", error)
      return false
    }
  }

  return (
    <>
      <TopBar
        breadCrumbs={[
          {
            id: "forms",
            children: "Forms",
          },
        ]}
      />
      <ul className="flex flex-col gap-y-1 bg-gray-100 py-1">
        {forms?.map((form) => {
          const { id, name, openings: formOpenings, type, createdAt } = form

          // Define menu items for the form
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
              onAction: () => handleDuplicateForm(id),
            },
            {
              id: "delete",
              Icon: Trash,
              children: "Delete",
              onAction: () => handleDeleteForm(id),
            },
          ]

          // Define top row items (metadata with bullet separators)
          const topRowItems = [
            {
              id: "type",
              content:
                type === GetForms200ResponseInnerTypeEnum.Application
                  ? "Application Form"
                  : "Review Form",
            },
            {
              id: "updated",
              content: `Updated ${dayjs(form.updatedAt).fromNow()}`,
            },
          ]

          // Define bottom row items (selectors)
          const bottomRowContent =
            type === GetForms200ResponseInnerTypeEnum.Application ? (
              <OpeningsSelector
                selection={formOpenings.map(({ id }) => id)}
                onChange={(openingId, selected) =>
                  handleOpeningSelectionChange(id, openingId, selected)
                }
                placement="bottom left"
              />
            ) : null

          return (
            <WorkspaceItem
              key={id}
              id={id}
              name={name}
              isRenaming={renamingFormId === id}
              linkTo=""
              linkParams={{
                code,
              }}
              linkSearch={{
                drw: {
                  id: "fm",
                  e: id,
                },
              }}
              menuItems={menuItems}
              topRowItems={topRowItems}
              bottomRowItems={bottomRowContent}
              onRenameStart={handleStartRename}
              onRenameSubmit={handleSubmitRename}
              onRenameKeyDown={handleRenameKeyDown}
            />
          )
        })}
      </ul>
    </>
  )
}
