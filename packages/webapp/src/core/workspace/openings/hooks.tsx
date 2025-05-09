import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { useCallback } from "react"
import {
  type GetApplications200ResponseInnerNotes,
  type GetAttributes200ResponseInner,
  GetAttributes200ResponseInnerEntityTypeEnum,
  type UpdateAnOpeningRequestStatusEnum,
} from "sdks/src/server-sdk"
import type {
  DataGridColumn,
  IRow,
} from "~/routes/(workspace)/-components/data-grid/types"
import type { EntityLayoutProps } from "~/routes/(workspace)/-components/entity/entity-layout"
import type { Filter } from "~/routes/(workspace)/-components/filters/types"
import { DataTypeEnum } from "~/types"
import type { Opening } from "~/types/entities"
import type { BlockGroup } from "~/types/tiptap"
import { useWorkspaceApi } from "../api"
import { getCommonEntityColumns, getEntityFilters } from "../entities/util"
import { globals } from "../globals"
import { useWorkspaceParams } from "../navigation"
import { useConfiguredVariableTiptapExtension } from "../tiptap/variable-extension"

export const useOpeningsFieldUpdateHandlers: () => EntityLayoutProps<IRow>["fieldUpdateHandlers"] =
  () => {
    const api = useWorkspaceApi()
    return {
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
      status: async ({ entityId, value }) => {
        if (typeof value === "string")
          await api.opening.updateAnOpening({
            id: entityId,
            updateAnOpeningRequest: {
              status: value as UpdateAnOpeningRequestStatusEnum,
            },
          })
      },
    }
  }

export const useConfiguredOpeningVariableTiptapExtension = ({
  openingAttributes,
  roleAttributes,
}: {
  openingAttributes: GetAttributes200ResponseInner[]
  roleAttributes: GetAttributes200ResponseInner[]
}) => {
  const blocks: BlockGroup[] = [
    {
      id: "opening",
      name: "Opening",
      blocks: [
        {
          id: "description",
          name: "Description",
          onPress: ({ command }) => {
            command({
              id: "description",
              label: "Opening description",
              entity: GetAttributes200ResponseInnerEntityTypeEnum.Opening,
              type: "built-in",
            })
          },
        },
        ...openingAttributes.map(({ id, name }) => ({
          id,
          name,
          onPress: ({ command }) => {
            command({
              id: id,
              label: `Opening ${name}`,
              entity: GetAttributes200ResponseInnerEntityTypeEnum.Opening,
              type: "custom",
            })
          },
        })),
      ],
    },
    {
      id: "role",
      name: "Role",
      blocks: [
        {
          id: "description",
          name: "Description",
          onPress: ({ command }) => {
            command({
              id: "description",
              label: "Role description",
              entity: GetAttributes200ResponseInnerEntityTypeEnum.Role,
              type: "built-in",
            })
          },
        },
        ...roleAttributes.map(({ id, name }) => ({
          id,
          name,
          onPress: ({ command }) => {
            command({
              id: id,
              label: `Opening ${name}`,
              entity: GetAttributes200ResponseInnerEntityTypeEnum.Opening,
              type: "custom",
            })
          },
        })),
      ],
    },
  ]
  return useConfiguredVariableTiptapExtension({ blocks })
}

export const useMergeOpeningColumns = () => {
  const { code } = useWorkspaceParams()
  const mergeOpeningColumns = useCallback(
    (columns: DataGridColumn<Opening>[]): DataGridColumn<Opening>[] => [
      {
        primary: true,
        key: "title",
        name: "Opening",
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
          options: {
            items: [
              {
                name: "Draft",
                id: "Draft",
              },
              {
                name: "Published",
                id: "Published",
              },
            ],
            isMultiSelect: false,
          },
        },
        configuration: {},
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
        transform: (count: number, { data }) => (
          <Link
            to={"/w/$code/applications"}
            params={{ code }}
            className="flex h-full items-center text-gray-500"
            onClick={() => {
              globals.filters = {
                Application: [
                  {
                    id: "Opening.id",
                    value: data.id,
                    operator: "eq",
                  },
                ],
              }
            }}
          >
            {count}
          </Link>
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
    ],
    [code],
  )

  return mergeOpeningColumns
}

export const useOpeningFilters = ({
  attributes,
}: { attributes: GetAttributes200ResponseInner[] }) => {
  const api = useWorkspaceApi()
  const { data: roles = [] } = useQuery({
    queryKey: [api.role.getRoles.name],
    queryFn: () => api.role.getRoles(),
  })

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
      type: DataTypeEnum.Select,
      nullable: false,
      origin: "system",
      options: {
        items: roles.map((role) => ({
          id: role.id,
          name: role.title,
        })),
        isMultiSelect: false,
        nullable: false,
      },
    },
  ]
  const filters: Filter[] = getEntityFilters({ attributes, entityFilters })

  return filters
}
