import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import dayjs from "dayjs"
import { useCallback, useMemo } from "react"
import type { GetAttributes200ResponseInner } from "sdks/src/server-sdk"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import {
  getCommonEntityColumns,
  getEntityFilters,
} from "~/core/workspace/entities/util"
import { useWorkspace } from "~/core/workspace/workspace.context"
import type { DataGridColumn } from "~/routes/(workspace)/-components/data-grid/types"
import EntityViewLayout from "~/routes/(workspace)/-components/entity/entity-layout"
import type { SelectedFilter } from "~/routes/(workspace)/-components/filters/types"
import { type BreadCrumb, DataTypeEnum } from "~/types"
import type { Application, Candidate, Opening } from "~/types/entities"

interface Props {
  defaultSelectedFilters?: SelectedFilter[]
  attributes: GetAttributes200ResponseInner[]
  // filters: Filter[]
  breadCrumbs?: BreadCrumb[]
  viewId?: string
}

const ApplicationsLayout = ({
  defaultSelectedFilters,
  attributes,
  // filters,
  breadCrumbs = [],
  viewId,
}: Props) => {
  const api = useWorkspaceApi()
  const workspace = useWorkspace()
  const { data: openings = [] } = useQuery({
    queryKey: [api.opening.getOpenings.name],
    queryFn: () => api.opening.getOpenings(),
  })
  const { data: roles = [] } = useQuery({
    queryKey: [api.role.getRoles.name],
    queryFn: () => api.role.getRoles(),
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: Performance optimization
  const statusOptions = useMemo(
    () => ({
      items: workspace.applicationStatuses.map((status) => ({
        name: status.name,
        id: status.id,
      })),
      isMultiSelect: false,
      nullable: false,
    }),
    [JSON.stringify(workspace.applicationStatuses)],
  )

  const mergeColumns = useCallback(
    (columns: DataGridColumn<Application>[]): DataGridColumn<Application>[] => {
      return [
        {
          type: "system",
          key: "candidate",
          name: "Candidate",
          initialWidth: "w-44",
          field: {
            type: "Record",
          },
          transform: (data: Candidate) => {
            return (
              <Link
                to=""
                search={{ drw: { id: "cd", e: data.id } }}
                tabIndex={-1}
                className="-ml-1 inline-block h-6 rounded-md px-1.5 leading-6 hover:bg-slate-100"
              >{`${data.firstName} ${data.lastName}`}</Link>
            )
          },
        },
        {
          type: "system",
          key: "candidate.firstName",
          name: "Candidate",
          initialWidth: "w-40",
          field: {
            type: "Text",
            options: {},
          },
          transform: (data: Candidate) => data.firstName,
          hideInGrid: true, // Hide in grid but available for sorting
        },
        {
          type: "system",
          key: "statusId",
          name: "Status",
          initialWidth: "w-40",
          field: {
            type: "Select",
            options: statusOptions,
          },
          transform: (statusId: string) => {
            const status = workspace.applicationStatuses.find(
              (status) => status.id === statusId,
            )

            return status?.name ?? ""
          },
        },
        {
          type: "system",
          key: "opening",
          name: "Opening",
          initialWidth: "w-52",
          field: {
            type: "Record",
          },
          transform: (data: Opening) => {
            return (
              <Link
                to=""
                search={{ drw: { id: "op", e: data.id } }}
                tabIndex={-1}
                className="flex h-6 w-full items-center text-slate-500"
              >
                {data.title}
              </Link>
            )
          },
        },
        ...columns,
        ...getCommonEntityColumns().map((column) =>
          column.key === "createdAt"
            ? {
                ...column,
                name: "Applied",
                transform: (data: Date) => (
                  <span className="text-gray-500">{dayjs(data).fromNow()}</span>
                ),
              }
            : { ...column },
        ),
      ]
    },
    [workspace.applicationStatuses, statusOptions],
  )

  const filters = getEntityFilters({
    attributes,
    entityFilters: [
      {
        id: "Candidate.firstName",
        name: "First Name",
        type: DataTypeEnum.Text,
        defaultOperator: "contains",
        origin: "system",
      },
      {
        id: "Candidate.lastName",
        name: "Last Name",
        type: DataTypeEnum.Text,
        defaultOperator: "contains",
        origin: "system",
      },
      {
        id: "Candidate.email",
        name: "Email",
        type: DataTypeEnum.Email,
        defaultOperator: "contains",
        origin: "system",
      },
      {
        id: "Opening.id",
        name: "Opening",
        type: DataTypeEnum.Select,
        defaultOperator: "eq",
        origin: "system",
        options: {
          items: openings.map((opening) => ({
            name: opening.title,
            id: opening.id,
          })),
          isMultiSelect: true,
          nullable: true,
        },
      },
      {
        id: "Opening.Role.id",
        name: "Role",
        type: DataTypeEnum.Select,
        defaultOperator: "eq",
        origin: "system",
        options: {
          items: roles.map((role) => ({
            name: role.title,
            id: role.id,
          })),
          isMultiSelect: true,
          nullable: true,
        },
      },
      {
        id: "ApplicationStatus.id",
        name: "Status",
        type: DataTypeEnum.Select,
        defaultOperator: "contains",
        origin: "system",
        options: statusOptions,
      },
    ],
  })

  const getIdentifier = (row: Application) => row.numberInWorkspace.toString()

  return (
    <EntityViewLayout
      entityType="Application"
      attributes={attributes}
      filters={filters}
      breadCrumbs={breadCrumbs}
      {...(viewId && { viewId })}
      fieldUpdateHandlers={{
        statusId: async (data) => {
          const value = data.value as string
          const status = workspace.applicationStatuses.find(
            (status) => status.id === value,
          )
          if (!status) return

          await api.application.updateApplication({
            id: data.entityId,
            updateApplicationRequest: {
              statusId: status.id,
            },
          })
          queryClient.invalidateQueries({
            queryKey: [api.application.getApplication.name, data.entityId],
          })
          queryClient.invalidateQueries({
            queryKey: [api.application.getApplications.name],
          })
          queryClient.invalidateQueries({
            queryKey: [api.activity.getActivities.name, data.entityId],
          })
        },
      }}
      mergeColumns={mergeColumns}
      getIdentifier={getIdentifier}
      defaultSelectedFilters={(defaultSelectedFilters ?? []).map(
        (selected) => ({
          ...selected,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          ...filters.find((filter) => filter.id === selected.id)!,
        }),
      )}
      sorts={[{ id: "createdAt", order: "desc" }]}
    />
  )
}

export default ApplicationsLayout
