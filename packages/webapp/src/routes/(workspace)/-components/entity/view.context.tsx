import type { QueryObserverResult } from "@tanstack/react-query"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { type ReactNode, createContext, useContext, useState } from "react"
import type {
  CreateViewRequestEntityTypeEnum,
  GetApplications200ResponseInner,
  GetApplications200ResponseInnerCandidate,
  GetForms200ResponseInnerOpeningsInner,
  GetRoles200ResponseInner,
} from "sdks/src/server-sdk"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { globals } from "~/core/workspace/globals"
import { useWorkspaceParams } from "~/core/workspace/navigation"
import { useWorkspaceContext } from "~/core/workspace/workspace.context"
import type { SortColumn } from "~/types"
import type { Attribute } from "~/types/entities"
import type { DataGridColumn, IRow } from "../data-grid/types"
import type { Filter, SelectedFilter } from "../filters/types"

type Refetch = () => Promise<
  QueryObserverResult<
    | GetApplications200ResponseInnerCandidate[]
    | GetApplications200ResponseInner[]
    | GetForms200ResponseInnerOpeningsInner[]
    | GetRoles200ResponseInner[],
    Error
  >
>

interface ViewContextType {
  // Filters
  filters: Filter[]
  selectedFilters: SelectedFilter[]
  defaultSelectedFilters: SelectedFilter[]
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilter[]>>

  // Sorting
  columns: DataGridColumn<IRow>[]
  sortColumns: SortColumn[]
  setSortColumns: (columns: SortColumn[]) => void

  // View management
  viewId?: string
  viewName: string
  setViewName: (name: string) => void
  saveView: (isPublic?: boolean) => Promise<void>
  updateViewConfig: () => Promise<void>
  refetch: Refetch
  attributes: Attribute[]
  entitiesQueryKey: unknown[]
}

const ViewContext = createContext<ViewContextType | null>(null)

export const useViewContext = () => {
  const context = useContext(ViewContext)
  if (!context) {
    throw new Error("useViewContext must be used within a ViewProvider")
  }
  return context
}

interface ViewProviderProps {
  children: ReactNode
  initialFilters?: Filter[]
  initialSelectedFilters?: SelectedFilter[]
  initialSortColumns?: SortColumn[]
  initialColumns?: DataGridColumn<IRow>[]
  initialViewName?: string
  initialViewId?: string
  entityType: CreateViewRequestEntityTypeEnum
  refetch: Refetch
  filters: Filter[]
  selectedFilters: SelectedFilter[]
  defaultSelectedFilters?: SelectedFilter[]
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilter[]>>
  attributes: Attribute[]
  viewId?: string
  sortColumns: SortColumn[]
  setSortColumns: (columns: SortColumn[]) => void
  entitiesQueryKey: unknown[]
}

export const ViewProvider = ({
  children,
  initialSortColumns = [],
  initialColumns = [],
  initialViewName = "My View",
  entityType,
  refetch,
  filters,
  selectedFilters,
  setSelectedFilters: _setSelectedFilters,
  attributes,
  viewId,
  defaultSelectedFilters = [],
  setSortColumns: _setSortColumns,
  sortColumns,
  entitiesQueryKey,
}: ViewProviderProps) => {
  const navigate = useNavigate()
  const api = useWorkspaceApi()
  const router = useRouter()
  const { setAppState } = useWorkspaceContext()
  const { code } = useWorkspaceParams()

  // Sorting state
  const [columns, setColumns] = useState<IColumn[]>(initialColumns)

  const setSortColumns = (columns: SortColumn[]) => {
    globals.sorts = columns
    _setSortColumns(columns)
    if (viewId) {
      updateViewConfig({ sorts: columns })
    }
  }
  const setSelectedFilters = (filters: SelectedFilter[]) => {
    globals.filters = {
      ...globals.filters,
      [entityType]: filters,
    }
    _setSelectedFilters(filters)
  }

  // View state
  const [viewName, setViewName] = useState<string>(initialViewName)

  // Save view function
  const saveView = async (isPublic = true) => {
    try {
      const view = await api.view.createView({
        createViewRequest: {
          entityType: entityType,
          name: viewName,
          config: {
            filters: selectedFilters.map((item) => ({
              ...filters.find((filter) => filter.id === item.id),
              ...item,
            })),
            sorting: sortColumns,
          },
          _public: isPublic,
        },
      })

      setViewName("")
      setSelectedFilters([])
      setAppState((state) => ({ ...state, entityView: "default" }))
      queryClient.invalidateQueries({
        queryKey: [api.view.getViews.name],
      })

      const params = { code, slug: view.id }
      switch (entityType) {
        case "Candidate":
          navigate({
            to: "/w/$code/candidates/$slug",
            params,
          })
          break
        case "Application":
          navigate({
            to: "/w/$code/applications/$slug",
            params,
          })
          break
        case "Role":
          break
        case "Opening":
          break
        default:
          break
      }
    } catch (error) {
      console.error("Failed to save view:", error)
    }
  }

  // Update view function
  const updateViewConfig = async (config?: { sorts?: SortColumn[] }) => {
    const { sorts } = config ?? {}
    if (!viewId) return

    try {
      await api.view.updateView({
        id: viewId,
        updateViewRequest: {
          config: {
            filters: selectedFilters.map((item) => ({
              ...filters.find((filter) => filter.id === item.id),
              ...item,
            })),
            sorting: sorts ?? sortColumns,
          },
        },
      })
      queryClient.invalidateQueries({
        queryKey: [api.view.getView.name, viewId],
      })
    } catch (error) {
      console.error("Failed to update view:", error)
    }
  }

  const value = {
    filters,
    selectedFilters,
    setSelectedFilters,
    columns,
    sortColumns,
    setSortColumns,
    viewName,
    setViewName,
    saveView,
    updateViewConfig,
    refetch,
    attributes,
    ...(viewId && { viewId }),
    entitiesQueryKey,
    defaultSelectedFilters,
  }

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>
}
