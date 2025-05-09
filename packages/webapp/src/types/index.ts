import { GetAttributes200ResponseInnerDataTypeEnum } from "sdks/src/server-sdk"
import type Breadcrumbs from "webui-library/src/breadcrumbs"

export const DataTypeEnum = GetAttributes200ResponseInnerDataTypeEnum
export type BreadCrumb = React.ComponentProps<
  typeof Breadcrumbs
>["breadcrumbs"][number]
export interface SortColumn {
  id: string
  order: "asc" | "desc"
}
