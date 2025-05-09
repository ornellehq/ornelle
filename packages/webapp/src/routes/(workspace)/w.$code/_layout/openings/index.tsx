import { createFileRoute } from "@tanstack/react-router"
import { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import UserAdd from "webui-library/src/icons/UserAdd"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import { useEntityDelete } from "~/core/workspace/entities/use-entity-delete"
import { globals } from "~/core/workspace/globals"
import {
  useMergeOpeningColumns,
  useOpeningFilters,
  useOpeningsFieldUpdateHandlers,
} from "~/core/workspace/openings/hooks"
import EntityViewLayout from "~/routes/(workspace)/-components/entity/entity-layout"

export const Route = createFileRoute("/(workspace)/w/$code/_layout/openings/")({
  component: Openings,
})

function Openings() {
  const { data: attributes } = useEntityAttributes([
    GetAttributesEntityTypesEnum.Opening,
  ])
  const filters = useOpeningFilters({ attributes })
  const fieldUpdateHandlers = useOpeningsFieldUpdateHandlers()

  const { showDeleteConfirmation } = useEntityDelete({
    entityType: "Opening",
    entityName: "Opening",
  })

  return (
    <EntityViewLayout
      entityType="Opening"
      attributes={attributes}
      filters={filters}
      breadCrumbs={[
        {
          id: "openings",
          children: "Openings",
        },
      ]}
      mergeColumns={useMergeOpeningColumns()}
      fieldUpdateHandlers={fieldUpdateHandlers}
      Icon={UserAdd}
      rowMenu={(opening) => {
        return {
          items: [
            {
              id: "delete",
              children: "Delete",
              onAction: () => showDeleteConfirmation(opening.id),
            },
          ],
        }
      }}
      defaultSelectedFilters={globals.filters.Opening ?? []}
    />
  )
}
