import { motion } from "framer-motion"
import { Button } from "webui-library/src/button"
import DisplayView from "webui-library/src/icons/PropertyView"
import ArrowUpDown from "webui-library/src/icons/arrow-up-down"
import Sorting01 from "webui-library/src/icons/sorting-01"
import Dropdown from "webui-library/src/widgets/dropdown"
import Menu from "webui-library/src/widgets/menu"
import type { SortColumn } from "~/types"
import { useViewContext } from "./entity/view.context"
import FilterPicker from "./filters/filter-picker"

const ViewCustomizationBar = () => {
  const { columns, sortColumns, setSortColumns, viewId, updateViewConfig } =
    useViewContext()

  return (
    <div className="flex h-10 items-center justify-between divide-x divide-gray-200 border-gray-100 border-b border-solid bg-opacity-90 px-5 pr-6 text-[13px]">
      <motion.div
        layout
        transition={{ duration: 0.1 }}
        className="flex items-center gap-x-2 pr-3 text-[13px]"
      >
        <Menu
          triggerButton={{
            className:
              "flex h-6 w-auto items-center gap-x-1 rounded-md px-1.5 border border-[#ECEDEF] shadow-[0px_1px_2px_rgba(0,0,0,0.1)]",
            children: (
              <>
                <DisplayView
                  width={13}
                  height={13}
                  className="text-[#967696]"
                />
                <span>Customize view</span>
              </>
            ),
          }}
          popover={{
            placement: "bottom left",
            className:
              "max-h-96 w-80 p-3 py-4 text-[13px] overflow-y-auto border border-gray-300",
            children: (
              <>
                <div className="flex items-center gap-x-1 bg-opaciity-80">
                  <ArrowUpDown width={16} />
                  <span className="flex-1">Ordering</span>
                  <Dropdown
                    autoFocus
                    selectedKey={sortColumns[0]?.id ?? null}
                    button={{
                      className: "h-6 w-36 leading-6 border-none bg-gray-100",
                    }}
                    items={columns.map(({ key, name }) => ({
                      id: key,
                      children: name,
                      className: "w-36",
                    }))}
                    popover={{
                      className: "max-h-96 overflow-y-auto",
                    }}
                    onSelectionChange={(key) => {
                      const id = key as string
                      const column = columns.find((column) => column.key === id)
                      if (column) {
                        const sort: SortColumn[] = [{ id, order: "desc" }]
                        setSortColumns(sort)
                        if (viewId) {
                          updateViewConfig()
                        }
                      }
                    }}
                  />
                  <Button
                    variant="plain"
                    className={`inline-flex h-6 w-6 transform items-center justify-center bg-gray-100 ${
                      sortColumns[0]?.order === "desc" ? "" : "-scale-y-100"
                    }`}
                    onPress={() => {
                      const sort = sortColumns[0]
                      if (sort) {
                        const newSort: SortColumn[] = [
                          {
                            ...sort,
                            order: sort.order === "asc" ? "desc" : "asc",
                          },
                        ]
                        setSortColumns(newSort)
                        if (viewId) {
                          updateViewConfig()
                        }
                      }
                    }}
                  >
                    <Sorting01 />
                  </Button>
                </div>
              </>
            ),
          }}
        />
      </motion.div>
      <FilterPicker />
    </div>
  )
}

export default ViewCustomizationBar
