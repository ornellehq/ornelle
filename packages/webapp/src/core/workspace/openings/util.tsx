import type { GetAttributes200ResponseInner } from "sdks/src/server-sdk"
import type { DataGridColumn } from "~/routes/(workspace)/-components/data-grid/types"
import type { Filter } from "~/routes/(workspace)/-components/filters/types"
import { DataTypeEnum } from "~/types"
import type { Opening } from "~/types/entities"
import { getCommonEntityColumns, getEntityFilters } from "../entities/util"

export const getOpeningFilters = ({
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
    {
      id: "Role.id",
      name: "Role",
      type: DataTypeEnum.Record,
      nullable: false,
      origin: "system",
    },
  ]
  const filters: Filter[] = getEntityFilters({ attributes, entityFilters })

  return filters
}

// const LinkToProcess = ({
//   name,
//   id,
// }: {
//   name: string
//   id: string
// }) => {
//   const { code } = useWorkspaceParams()
//   return (
//     <Link
//       tabIndex={-1}
//       to="/w/$code/processes/$id"
//       params={{
//         code,
//         id,
//       }}
//       className="inline-block h-6 rounded-md px-1.5 leading-6 hover:bg-slate-100"
//     >
//       {name}
//     </Link>
//   )
// }

export const mergeOpeningColumns = (
  columns: DataGridColumn<Opening>[],
): DataGridColumn<Opening>[] => {
  return [
    {
      primary: true,
      key: "title",
      name: "Role",
      sortName: "Title",
      type: "system",
      initialWidth: "w-64",
      field: {
        type: "Text",
        options: {},
      },
    },
    {
      key: "description",
      name: "Description",
      type: "system",
      initialWidth: "w-48",
      transform: (data: Opening["description"]) => {
        const div = document.createElement("div")
        div.innerHTML = data?.html ?? ""
        return div.textContent ?? ""
      },
      field: {
        type: "Text",
        options: {
          format: "rte",
        },
      },
    },
    {
      key: "status",
      name: "Status",
      type: "system",
      initialWidth: "w-24",
      field: {
        type: "Select",
        options: {},
      },
      configuration: {
        options: ["Published", "Draft"],
      },
    },
    {
      key: "applicationsCount",
      name: "Applications",
      type: "system",
      initialWidth: "w-24",
      field: {
        type: "Number",
        options: {},
      },
      editable: false,
      transform: (count: number) => (
        <span className="text-gray-500">{count}</span>
      ),
    },

    ...columns,

    // {
    //   key: "role",
    //   name: "Role",
    //   type: "system",
    //   initialWidth: "w-64",
    //   transform: (data: NonNullable<Opening["role"]>) => {
    //     return (
    //       <Link
    //         tabIndex={-1}
    //         to=""
    //         search={{ drw: { id: "role", e: data.id } }}
    //         className="inline-block h-6 rounded-md px-1.5 leading-6 hover:bg-slate-100"
    //       >
    //         {data.title}
    //       </Link>
    //     )
    //   },
    // },
    // {
    //   key: "workflow",
    //   name: "Process",
    //   type: "system",
    //   initialWidth: "w-64",
    //   transform: (data: Opening["workflow"]) => {
    //     return <LinkToProcess name={data.name} id={data.id} />
    //   },
    // },
    ...getCommonEntityColumns(),
  ]
}
