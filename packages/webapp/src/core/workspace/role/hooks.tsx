import { Link } from "@tanstack/react-router"
import { useCallback } from "react"
import type { GetApplications200ResponseInnerNotes } from "sdks/src/server-sdk"
import type {
  DataGridColumn,
  IRow,
} from "~/routes/(workspace)/-components/data-grid/types"
import type { EntityLayoutProps } from "~/routes/(workspace)/-components/entity/entity-layout"
import type { Role } from "~/types/entities"
import { useWorkspaceApi } from "../api"
import { getCommonEntityColumns } from "../entities/util"
import { globals } from "../globals"
import { useWorkspaceParams } from "../navigation"
import { rolesBuiltInColumns } from "./data"

export const useRoleFieldUpdateHandlers: () => EntityLayoutProps<IRow>["fieldUpdateHandlers"] =
  () => {
    const api = useWorkspaceApi()
    return {
      title: async ({ entityId, value }) => {
        if (typeof value === "string")
          await api.role.updateARole({
            id: entityId,
            updateARoleRequest: { title: value },
          })
      },
      description: async ({ entityId, value }) => {
        if (typeof value === "object")
          await api.role.updateARole({
            id: entityId,
            updateARoleRequest: {
              description: value as GetApplications200ResponseInnerNotes,
            },
          })
      },
    }
  }

export const useMergeRoleColumns = () => {
  const { code } = useWorkspaceParams()
  const mergeColumns = useCallback(
    (columns: DataGridColumn<Role>[]): DataGridColumn<Role>[] => {
      return [
        ...rolesBuiltInColumns,
        {
          key: "openingsCount",
          name: "Openings",
          type: "system",
          initialWidth: "w-24",
          field: {
            type: "Number",
            options: {},
          },
          editable: false,
          transform: (count: number, { data }) => (
            <Link
              tabIndex={-1}
              className="flex h-full items-center text-gray-500"
              to="/w/$code/openings"
              params={{ code }}
              onClick={() => {
                globals.filters = {
                  ...globals.filters,
                  Opening: [
                    {
                      id: "Role.id",
                      value: data.id,
                      operator: "eq",
                    },
                  ],
                }
              }}
            >
              <span>{count}</span>
            </Link>
          ),
        },
        ...columns,
        ...getCommonEntityColumns(),
      ]
    },
    [code],
  )

  return mergeColumns
}
