import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ResponseError } from "sdks/src/server-sdk"
import { toast } from "sonner"
import { useWorkspaceApi } from "../api"
import { globals } from "../globals"
import { useWorkspaceContext } from "../workspace.context"

interface UseEntityDeleteOptions<T extends "Role" | "Opening"> {
  entityType: T
  entityName: string
}

export function useEntityDelete<T extends "Role" | "Opening">({
  entityType,
  entityName,
}: UseEntityDeleteOptions<T>) {
  const api = useWorkspaceApi()
  const queryClient = useQueryClient()
  const { setAppState } = useWorkspaceContext()

  // Choose the right query key for invalidation
  const queryKey =
    entityType === "Role"
      ? api.role.getRoles.name
      : api.opening.getOpenings.name

  const deleteEntityMutation = useMutation({
    mutationFn: (entityId: string) => {
      if (entityType === "Role") {
        return api.role.deleteRole({ id: entityId })
      }
      return api.opening.deleteOpening({ id: entityId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey, globals.filters[entityType], globals.sorts],
      })
      setAppState((state) => ({
        ...state,
        confirmationModal: null,
      }))
    },
    onError: async (_) => {
      const error = _ as Error | ResponseError
      console.error(`Error deleting ${entityName}:`, error)
      toast.error(
        "response" in error
          ? (await error.response.json()).message
          : `Failed to delete ${entityName}. Please try again.`,
      )
      // setAppState((state) => ({
      //   ...state,
      //   confirmationModal: null,
      // }))
    },
  })

  const showDeleteConfirmation = (entityId: string) => {
    setAppState((state) => ({
      ...state,
      confirmationModal: {
        open: true,
        title: `Delete ${entityName}`,
        description: `Are you sure you want to delete this ${entityName.toLowerCase()}? This action cannot be undone.`,
        confirmButton: {
          children: "Delete",
          onPress: async () => {
            await deleteEntityMutation.mutateAsync(entityId)
          },
        },
      },
    }))
  }

  return {
    deleteEntityMutation,
    showDeleteConfirmation,
  }
}
