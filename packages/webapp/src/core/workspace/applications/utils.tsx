import type { Filter } from "~/routes/(workspace)/-components/filters/types"
import { DataTypeEnum } from "~/types"
import type { Attribute } from "~/types/entities"
import { getEntityFilters } from "../entities/util"

export const getApplicationFilters = ({
  attributes,
}: { attributes: Attribute[] }) => {
  const entityFilters: Filter[] = [
    // Candidate filters
    {
      id: "candidate.firstName",
      name: "Candidate First Name",
      type: DataTypeEnum.Text,
      defaultOperator: "contains",
      origin: "system",
    },
    {
      id: "candidate.lastName",
      name: "Candidate Last Name",
      type: DataTypeEnum.Text,
      defaultOperator: "contains",
      origin: "system",
    },
    {
      id: "candidate.email",
      name: "Candidate Email",
      type: DataTypeEnum.Email,
      defaultOperator: "contains",
      origin: "system",
    },
    {
      id: "candidate.statusId",
      name: "Candidate Status",
      type: DataTypeEnum.Select,
      defaultOperator: "contains",
      origin: "system",
      options: {
        items: [],
        isMultiSelect: false,
        nullable: false,
      },
    },
  ]
  return getEntityFilters({ attributes, entityFilters })
}
