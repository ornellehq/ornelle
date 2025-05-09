import type {
  GetApplications200ResponseInnerNotes,
  GetAttributes200ResponseInner,
} from "sdks/src/server-sdk"
import { useWorkspaceApi } from "~/core/workspace/api"
import { builtInOpeningColumns } from "~/core/workspace/openings/util"
import EntityViewLayout from "~/routes/(workspace)/-components/entity/entity-layout"
import type {
  Filter,
  SelectedFilter,
} from "~/routes/(workspace)/-components/filters/types"
import type { BreadCrumb } from "~/types"

interface Props {
  defaultSelectedFilters?: (SelectedFilter & Filter)[]
  attributes: GetAttributes200ResponseInner[]
  filters: Filter[]
  breadCrumbs?: BreadCrumb[]
  viewId?: string
}

const OpeningsView = ({
  viewId,
  attributes,
  filters,
  breadCrumbs = [],
  defaultSelectedFilters,
}: Props) => {
  const api = useWorkspaceApi()

  return (
    <EntityViewLayout
      entityType="Opening"
      attributes={attributes}
      filters={filters}
      breadCrumbs={breadCrumbs}
      builtInColumns={builtInOpeningColumns}
      fieldUpdateHandlers={{
        title: async ({ entityId, value }) => {
          if (typeof value === "string")
            await api.opening.updateAnOpening({
              id: entityId,
              updateAnOpeningRequest: { title: value },
            })
        },
        description: async ({ entityId, value }) => {
          if (typeof value === "object")
            await api.opening.updateAnOpening({
              id: entityId,
              updateAnOpeningRequest: {
                description: value as GetApplications200ResponseInnerNotes,
              },
            })
        },
      }}
      {...(defaultSelectedFilters ? { defaultSelectedFilters } : {})}
      {...(viewId ? { viewId } : {})}
    />
  )
}

export default OpeningsView
