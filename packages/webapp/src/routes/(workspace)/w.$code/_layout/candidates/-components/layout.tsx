import { Link } from "@tanstack/react-router"
import { useCallback } from "react"
import type { GetAttributes200ResponseInner } from "sdks/src/server-sdk"
import { useWorkspaceApi } from "~/core/workspace/api"
import { getCommonEntityColumns } from "~/core/workspace/entities/util"
import { globals } from "~/core/workspace/globals"
import { useWorkspaceParams } from "~/core/workspace/navigation"
import type { DataGridColumn } from "~/routes/(workspace)/-components/data-grid/types"
import EntityViewLayout from "~/routes/(workspace)/-components/entity/entity-layout"
import type {
  Filter,
  SelectedFilter,
} from "~/routes/(workspace)/-components/filters/types"
import type { BreadCrumb } from "~/types"
import type { Candidate } from "~/types/entities"

interface Props {
  defaultSelectedFilters?: (SelectedFilter & Filter)[]
  attributes: GetAttributes200ResponseInner[]
  filters: Filter[]
  breadCrumbs?: BreadCrumb[]
  viewId?: string
}

const CandidatesLayout = ({
  defaultSelectedFilters,
  attributes,
  filters,
  breadCrumbs = [],
  viewId,
}: Props) => {
  const api = useWorkspaceApi()
  const { code } = useWorkspaceParams()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mergeColumns = useCallback(
    (columns: DataGridColumn<Candidate>[]): DataGridColumn<Candidate>[] => {
      return [
        {
          key: "firstName",
          name: "First name",
          initialWidth: "w-44",
          field: {
            type: "Text",
            options: {},
          },
          type: "system",
        },
        {
          key: "lastName",
          name: "Last name",
          initialWidth: "w-44",
          field: {
            type: "Text",
            options: {},
          },
          type: "system",
        },
        {
          key: "email",
          name: "Email",
          initialWidth: "w-72",
          field: {
            type: "Email",
            options: {},
          },
          type: "system",
          editable: false,
        },
        {
          key: "applicationsCount",
          name: "Applications",
          initialWidth: "w-44",
          field: {
            type: "Number",
            options: {},
          },
          type: "system",
          editable: false,
          transform: (value: number, { data }) => (
            <Link
              className="flex h-full items-center text-gray-500"
              to="/w/$code/applications"
              params={{ code }}
              onClick={() => {
                globals.filters = {
                  ...globals.filters,
                  Application: [
                    {
                      id: "Candidate.email",
                      value: data.email,
                      operator: "eq",
                    },
                  ],
                }
              }}
            >
              {value}
            </Link>
          ),
        },
        ...columns,
        ...getCommonEntityColumns(),
      ]
    },
    [],
  )

  const getIdentifier = (row: Candidate) => row.numberInWorkspace.toString()

  return (
    <EntityViewLayout
      entityType="Candidate"
      attributes={attributes}
      filters={filters}
      breadCrumbs={breadCrumbs}
      {...(viewId && { viewId })}
      fieldUpdateHandlers={{
        firstName: async ({ entityId, value }) => {
          await api.candidate.updateACandidate({
            id: entityId,
            updateACandidateRequest: { firstName: value as string },
          })
        },
        lastName: async ({ entityId, value }) => {
          await api.candidate.updateACandidate({
            id: entityId,
            updateACandidateRequest: { lastName: value as string },
          })
        },
        email: async ({ entityId, value }) => {
          await api.candidate.updateACandidate({
            id: entityId,
            updateACandidateRequest: { email: value as string },
          })
        },
      }}
      mergeColumns={mergeColumns}
      getIdentifier={getIdentifier}
      defaultSelectedFilters={defaultSelectedFilters ?? []}
      sorts={[{ id: "createdAt", order: "desc" }]}
    />
  )
}

export default CandidatesLayout
