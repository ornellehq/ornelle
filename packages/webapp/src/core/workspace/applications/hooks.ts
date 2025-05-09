import { type QueryOptions, useQuery } from "@tanstack/react-query"
import { useWorkspaceApi } from "../api"

/**
 * Hook to fetch application statuses for the current workspace
 * @returns Query result containing application statuses
 */
export const useApplicationStatuses = () => {
  const api = useWorkspaceApi()

  return useQuery({
    queryKey: [api.applicationStatus.getApplicationStatuses.name],
    queryFn: async () => {
      const statuses = await api.applicationStatus.getApplicationStatuses()
      return statuses
    },
  })
}

export const useApplication = (
  { id }: { id: string },
  queryOptions?: QueryOptions,
) => {
  const api = useWorkspaceApi()

  const query = useQuery({
    queryKey: [api.application.getApplication.name, id],
    queryFn: async () => {
      const response = await api.application.getApplicationRaw({ id })

      const previousId = response.raw.headers?.get("X-Previous") || null
      const nextId = response.raw.headers?.get("X-Next") || null
      const application = await response.value()
      if (application) {
        application._previousId = previousId
        application._nextId = nextId
      }

      return application
    },
    ...queryOptions,
  })

  return query
}
