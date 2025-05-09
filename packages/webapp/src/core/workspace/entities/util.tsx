import type { QueryStatus } from "@tanstack/react-query"
import dayjs from "dayjs"
import type { AttributeDataType } from "isomorphic-blocs/src/prisma"
import type { FormAttributeLink } from "isomorphic-blocs/src/types/form"
import {
  type GetAttributes200ResponseInner,
  GetAttributes200ResponseInnerDataTypeEnum,
  type GetProfiles200ResponseInner,
} from "sdks/src/server-sdk"
import User from "webui-library/src/icons/User"
import Alert from "webui-library/src/icons/alert"
import type { AttributeField } from "~/routes/(workspace)/-components/attributes/types"
import type {
  DataGridColumn,
  IRow,
} from "~/routes/(workspace)/-components/data-grid/types"
import type { Filter } from "~/routes/(workspace)/-components/filters/types"
import { DataTypeEnum } from "~/types"

export const candidateFieldOptions: FormAttributeLink[] = [
  {
    type: "built-in",
    id: "firstName",
    name: "First name",
    entity: "Candidate" as const,
    dataType: "Text",
  },
  {
    type: "built-in",
    id: "lastName",
    name: "Last name",
    entity: "Candidate" as const,
    dataType: "Text",
  },
  {
    type: "built-in",
    id: "email",
    name: "Email",
    entity: "Candidate" as const,
    dataType: "Email",
  },
]

export const applicationFieldOptions: FormAttributeLink[] = [
  {
    type: "built-in",
    id: "resumeText",
    name: "Resume",
    entity: "Application",
    dataType: "Text",
  },
]

export const getEntityFilters = ({
  attributes,
  entityFilters,
}: {
  attributes: GetAttributes200ResponseInner[]
  entityFilters: Filter[]
}) => {
  const filters: Filter[] = (
    [
      ...entityFilters,
      ...attributes.map((attribute) => ({
        id: attribute.id,
        name: attribute.name,
        origin: "custom" as const,
        ...(attribute.dataType ===
        GetAttributes200ResponseInnerDataTypeEnum.Select
          ? {
              type: GetAttributes200ResponseInnerDataTypeEnum.Select,
              options: {
                items: attribute._configuration.options.map(
                  (option: string) => ({
                    name: option,
                    id: option,
                  }),
                ),
                isMultiSelect: !!attribute._configuration.isMultiSelect,
                nullable: true,
              },
            }
          : { type: attribute.dataType }),
      })),
      {
        id: "udpatedAt",
        name: "Updated",
        type: DataTypeEnum.Date,
        nullable: false,
        origin: "system",
      },
      {
        id: "createdAt",
        name: "Created",
        type: DataTypeEnum.Date,
        nullable: false,
        origin: "system",
      },
    ] as const
  ).map((filter) => ({
    ...filter,
    ...(filter.type === DataTypeEnum.Text ||
    filter.type === DataTypeEnum.Email ||
    filter.type === DataTypeEnum.Url
      ? { defaultOperator: "contains" }
      : {}),
  }))

  return filters
}

export const getCommonEntityColumns = () => {
  const columns: DataGridColumn<IRow>[] = [
    {
      key: "createdAt",
      name: "Created",
      initialWidth: "w-48",
      field: {
        type: "Date",
      },
      type: "system",
      transform: (data) => (
        <span className="text-gray-500">
          {dayjs(data as Date).format("D MMM YYYY, HH:mm")}
        </span>
      ),
      editable: false,
    },
    // {
    //   key: "updatedAt",
    //   name: "Updated",
    //   initialWidth: "w-48",
    //   field: {
    //     type: "Date",
    //   },
    //   type: "system",
    //   transform: (data) => (
    //     <span className="text-gray-500">
    //       {dayjs(data as Date).format("D MMM YYYY, HH:mm")}
    //     </span>
    //   ),
    //   editable: false,
    // },
  ]

  return columns
}

export const convertAttributeToField = (
  { dataType, _configuration }: GetAttributes200ResponseInner,
  {
    profiles = [],
    profilesStatus = "success",
  }: {
    profiles: GetProfiles200ResponseInner[]
    profilesStatus: QueryStatus
  } = {
    profiles: [],
    profilesStatus: "success",
  },
) => {
  return {
    field: {
      ...(dataType === GetAttributes200ResponseInnerDataTypeEnum.Text &&
      _configuration.textType === "rich-text"
        ? {
            type: GetAttributes200ResponseInnerDataTypeEnum.Text as AttributeDataType,
            options: { format: "rte" },
          }
        : dataType === GetAttributes200ResponseInnerDataTypeEnum.Select
          ? {
              type: GetAttributes200ResponseInnerDataTypeEnum.Select as AttributeDataType,
              options: {
                items: _configuration.options.map((option: string) => ({
                  name: option,
                  id: option,
                })),
                isMultiSelect: !!_configuration.isMultiSelect,
              },
            }
          : { type: dataType as AttributeDataType }),
    } as AttributeField,
    configuration: _configuration,
    ...(dataType === GetAttributes200ResponseInnerDataTypeEnum.Date
      ? {
          transform: (data: string) => {
            return data ? dayjs(data).format("MMMM D, YYYY") : null
          },
        }
      : dataType === GetAttributes200ResponseInnerDataTypeEnum.Member
        ? {
            transform: (data: string) => {
              if (data && profilesStatus === "pending") {
                return (
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                )
              }

              const profile = profiles.find((p) => p.id === data)
              if (!profile) {
                if (data) {
                  return (
                    <div>
                      <Alert className="text-red-600" />
                    </div>
                  )
                }
                return null
              }

              return (
                <div className="flex items-center gap-x-1">
                  <User width={12} className="text-gray-400" />
                  {profile.displayName?.trim()
                    ? profile.displayName
                    : `${profile.firstName} ${profile.lastName ?? ""}`}
                </div>
              )
            },
          }
        : dataType === GetAttributes200ResponseInnerDataTypeEnum.Text &&
            _configuration.textType === "rich-text"
          ? {
              transform: (value) => {
                if (typeof value === "object") {
                  const div = document.createElement("div")
                  div.innerHTML = value?.html
                  const text = div.textContent ?? ""
                  return text as string
                }
                return value as string
              },
            }
          : dataType === GetAttributes200ResponseInnerDataTypeEnum.Select
            ? {
                transform: (data: string[]) => {
                  return data?.join?.(", ") ?? data
                },
              }
            : {}),
  }
}
