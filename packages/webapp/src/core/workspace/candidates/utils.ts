import type { GetAttributes200ResponseInner } from "sdks/src/server-sdk"
import type { Filter } from "~/routes/(workspace)/-components/filters/types"
import { DataTypeEnum } from "~/types"
import { getEntityFilters } from "../entities/util"

export const getCandidateFilters = ({
  attributes,
}: { attributes: GetAttributes200ResponseInner[] }) => {
  const entityFilters: Filter[] = [
    {
      id: "firstName",
      name: "First name",
      type: DataTypeEnum.Text,
      nullable: false,
      origin: "system",
    },
    {
      id: "lastName",
      name: "Last name",
      type: DataTypeEnum.Text,
      nullable: false,
      origin: "system",
    },
    {
      id: "email",
      name: "Email",
      type: DataTypeEnum.Email,
      nullable: false,
      origin: "system",
    },
  ]
  const filters: Filter[] = getEntityFilters({ attributes, entityFilters })

  return filters
}
