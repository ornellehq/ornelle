import type { EntityType } from "isomorphic-blocs/src/prisma"
import type { SelectedFilter } from "~/routes/(workspace)/-components/filters/types"
import type { SortColumn } from "~/types"

export const globals: {
  filters: Partial<Record<EntityType, SelectedFilter[]>>
  sorts: SortColumn[]
} = {
  filters: {},
  sorts: [],
}
export const workspacePreloadCache = { data: null }
