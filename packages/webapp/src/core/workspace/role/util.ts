import type { GetAttributes200ResponseInner } from "sdks/src/server-sdk"
import type { Filter } from "~/routes/(workspace)/-components/filters/types"
import { DataTypeEnum } from "~/types"
import { getEntityFilters } from "../entities/util"

export const getRoleFilters = ({
  attributes,
}: { attributes: GetAttributes200ResponseInner[] }) => {
  const entityFilters: Filter[] = [
    {
      id: "title",
      name: "Title",
      type: DataTypeEnum.Text,
      nullable: false,
      origin: "system",
    },
    {
      id: "description",
      name: "Description",
      type: DataTypeEnum.Text,
      nullable: false,
      origin: "system",
    },
  ]
  const filters: Filter[] = getEntityFilters({ attributes, entityFilters })

  return filters
}
