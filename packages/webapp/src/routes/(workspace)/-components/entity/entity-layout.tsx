import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import type { EntityType } from "isomorphic-blocs/src/prisma"
import { useEffect, useMemo, useRef, useState } from "react"
import type {
  CreateViewRequestEntityTypeEnum,
  GetApplications200ResponseInner,
  GetApplications200ResponseInnerCandidate,
  GetApplicationsRequest,
  GetAttributes200ResponseInner,
  GetAttributesEntityTypesEnum,
  GetCandidatesRequest,
  GetForms200ResponseInnerOpeningsInner,
  GetRoles200ResponseInner,
} from "sdks/src/server-sdk"
import type { GetOpeningsRequest } from "sdks/src/server-sdk/apis/OpeningApi"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import type { DrawerIDs } from "~/core/workspace/drawer/util"
import {
  useAttributeColumns,
  useEntityTypeToQueryKeyMap,
  useOnColumnUpdate,
  useOnFieldUpdate,
} from "~/core/workspace/entities/hooks"
import { globals } from "~/core/workspace/globals"
import type { BreadCrumb, SortColumn } from "~/types"
import type { Application, Candidate, Opening, Role } from "~/types/entities"
import DataGrid from "../data-grid"
import type { DataGridColumn, GridProps, IRow } from "../data-grid/types"
import type { Filter, SelectedFilter } from "../filters/types"
import ViewHeader from "./view-header"
import { ViewProvider } from "./view.context"

export interface EntityLayoutProps<T extends IRow>
  extends Pick<GridProps<T>, "Icon"> {
  defaultSelectedFilters?: (SelectedFilter & Filter)[]
  attributes: GetAttributes200ResponseInner[]
  filters: Filter[]
  breadCrumbs: BreadCrumb[]
  viewId?: string
  entityType: EntityType
  fieldUpdateHandlers?: Parameters<typeof useOnFieldUpdate>[0]["updateHandlers"]
  getIdentifier?: (row: T) => string
  sorts?: SortColumn[]
  mergeColumns?(columns: DataGridColumn<T>[]): DataGridColumn<T>[]
  rowMenu?: GridProps<T>["rowMenu"]
}

const entityTypeToDrwId: Record<EntityType, DrawerIDs> = {
  Application: "ap",
  Role: "role",
  Opening: "op",
  Candidate: "cd",
  // Custom actually isn't supported yet
  Custom: "role",
}

// Record<Exclude<EntityType, "custom">, { key: string }>

const EntityViewLayout = <T extends Application | Candidate | Role | Opening>({
  defaultSelectedFilters,
  attributes,
  filters,
  breadCrumbs,
  viewId,
  entityType,
  fieldUpdateHandlers,
  getIdentifier,
  sorts,
  mergeColumns,
  Icon,
  rowMenu,
}: EntityLayoutProps<T>) => {
  const navigate = useNavigate()
  const api = useWorkspaceApi()

  const initialFilters = useRef(
    (defaultSelectedFilters?.length
      ? defaultSelectedFilters
      : globals.filters[entityType] ?? []
    ).filter((filter) => filters.some((f) => f.id === filter.id)),
  )

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>(
    initialFilters.current,
  )

  const [sortColumns, setSortColumns] = useState<SortColumn[]>(
    sorts ?? [{ id: "createdAt", order: "desc" }],
  )

  const entityTypeToQueryKeyMap = useEntityTypeToQueryKeyMap()

  const queryKey = [
    entityTypeToQueryKeyMap.list[entityType],
    selectedFilters,
    sortColumns,
  ] as const

  const dataFetcher = async ({
    filters,
    sorts,
  }: {
    filters: typeof selectedFilters
    sorts: typeof sortColumns
  }): Promise<
    | GetApplications200ResponseInnerCandidate[]
    | GetApplications200ResponseInner[]
    | GetForms200ResponseInnerOpeningsInner[]
    | GetRoles200ResponseInner[]
  > => {
    const options = {
      ...(filters ? { filters } : {}),
      ...(sorts ? { sorts } : {}),
    }
    if (entityType === "Candidate")
      return api.candidate.getCandidates(options as GetCandidatesRequest)

    if (entityType === "Application")
      return api.application.getApplications(options as GetApplicationsRequest)

    if (entityType === "Opening")
      return api.opening.getOpenings(options as GetOpeningsRequest)

    return api.role.getRoles(options)
  }

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: (ctx) => {
      const [, entityFilters, sortColumns] = ctx.queryKey

      return dataFetcher({ filters: entityFilters, sorts: sortColumns })
    },
    initialData: [],
  })

  const attributeColumns = useAttributeColumns<T>(attributes ?? [])
  const onFieldUpdate = useOnFieldUpdate({
    invalidate: ({ entityId }) => {
      const singleQueryKey = [
        entityTypeToQueryKeyMap.single[entityType],
        entityId,
      ]
      queryClient.invalidateQueries({
        queryKey: singleQueryKey,
      })
      queryClient.invalidateQueries({
        queryKey,
      })
    },
    updateHandlers: fieldUpdateHandlers ?? {},
  })
  const onColumnUpdate = useOnColumnUpdate<T>(
    entityType as GetAttributesEntityTypesEnum,
  )

  const _columns = useMemo(
    () => mergeColumns?.(attributeColumns) ?? attributeColumns,
    [attributeColumns, mergeColumns],
  )
  const [columns, setColumns] = useState(_columns)

  useEffect(() => {
    setColumns((currentColumns) => {
      if (currentColumns.length === 0) return _columns

      const orderedColumns: DataGridColumn<T>[] = []

      for (const currentColumn of currentColumns) {
        const matchingNewColumn = _columns.find(
          (col) => col.key === currentColumn.key,
        )
        if (matchingNewColumn) {
          orderedColumns.push(matchingNewColumn)
        }
      }

      for (const newColumn of _columns) {
        const exists = orderedColumns.some((col) => col.key === newColumn.key)
        if (!exists) {
          orderedColumns.push(newColumn)
        }
      }

      return orderedColumns
    })
  }, [_columns])

  useEffect(() => {
    if (!viewId) {
      globals.filters = {
        ...globals.filters,
        [entityType]: initialFilters.current,
      }
    }
  }, [entityType, viewId])

  return (
    <ViewProvider
      filters={filters}
      selectedFilters={selectedFilters}
      setSelectedFilters={setSelectedFilters}
      initialSortColumns={sortColumns}
      {...(viewId && { viewId })}
      entityType={entityType as CreateViewRequestEntityTypeEnum}
      refetch={refetch}
      attributes={attributes}
      sortColumns={sortColumns}
      setSortColumns={setSortColumns}
      initialColumns={columns}
      {...(defaultSelectedFilters && { defaultSelectedFilters })}
      entitiesQueryKey={queryKey}
    >
      <ViewHeader breadCrumbs={breadCrumbs} />
      <DataGrid<T>
        name={entityType}
        columns={columns}
        setColumns={setColumns}
        data={data as T[]}
        expand={(entity) => {
          navigate({
            to: "",
            search: {
              drw: { id: entityTypeToDrwId[entityType], e: entity.id },
            },
          })
        }}
        onFieldUpdate={onFieldUpdate}
        onColumnUpdate={onColumnUpdate}
        {...(getIdentifier && { getIdentifier })}
        {...(Icon && { Icon })}
        {...(rowMenu && { rowMenu })}
      />
    </ViewProvider>
  )
}

export default EntityViewLayout
