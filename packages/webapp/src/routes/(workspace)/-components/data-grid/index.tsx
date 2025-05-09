import { useArrowNavigationGroup } from "@fluentui/react-tabster"
import { motion } from "framer-motion"
import type { EntityType } from "isomorphic-blocs/src/prisma"
import { type FunctionComponent, type ReactNode, useRef, useState } from "react"
import { useDrag, useDrop } from "react-aria"
import {
  type CreateAttributeRequestConfiguration,
  ResponseError,
} from "sdks/src/server-sdk"
import { toast } from "sonner"
import { Button } from "webui-library/src/button"
import { Form } from "webui-library/src/form"
import ArrowLeft from "webui-library/src/icons/ArrowLeft"
import ThreeDotsHorizontal from "webui-library/src/icons/ThreeDotsHorizontal"
import TransitionRight from "webui-library/src/icons/TransitionRight"
import { Label } from "webui-library/src/label"
import { Switch } from "webui-library/src/switch"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { cn } from "webui-library/src/utils/cn"
import Menu from "webui-library/src/widgets/menu"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useWorkspaceContext } from "~/core/workspace/workspace.context"
import ID from "~icons/hugeicons/id"
import attributeEditors from "../attributes/editors"
import type { AttributeField } from "../attributes/types"
import AttributeValueEditor from "../attributes/value-editor"
import CreateAttributePicker from "../create-attribute-picker"
import { useViewContext } from "../entity/view.context"
import type { DataGridColumn, GridProps, IRow } from "./types"
import { DataGridContext, useDataGridContext } from "./util"

type CellEditingComponent<T extends IRow> = FunctionComponent<{
  value: unknown
  close(value?: unknown): void
  data: IRow
  column: DataGridColumn<T>
}>

const Cell = <T extends IRow>({
  initialWidth,
  value,
  column,
  data,
  plainValue,
  openButton,
  expand,
  name,
}: {
  initialWidth: string
  value: React.ReactElement
  plainValue: unknown
  column: DataGridColumn<T>
  data: T
  openButton?: object
} & Pick<GridProps<T>, "expand" | "name">) => {
  const { onFieldUpdate } = useDataGridContext()
  const [{ editing, activeElement }, setEditing] = useState<{
    editing: boolean
    activeElement?: HTMLElement
  }>({ editing: false })
  const field = column.field
  const Editor = field ? attributeEditors[field.type] : undefined
  // const nonReactElements = ["function", "symbol"] as const
  // const valueType = typeof value
  const cellId = `cell-${column.key as string}-${data.id}`
  const isSwitch =
    field.type === "Toggle" &&
    column.configuration?.style?.toLowerCase() === "switch"
  const editable = column.editable ?? true
  const saveValue = (newValue: ReactNode, editing = false) => {
    if (!editing) setEditing({ editing: false })
    if (newValue === undefined) return
    if (
      (newValue !== plainValue || JSON.stringify({ value: newValue })) ===
      JSON.stringify({ value: plainValue })
    )
      return
    if (column.field?.type) {
      onFieldUpdate?.({
        value: newValue,
        attributeId: column.key as string,
        entityId: data.id,
        configuration: column.configuration,
        dataType: column.field?.type,
        // row: data,
        // column,
      })
    }
  }

  return (
    <div
      className={`group/cell inline-flex h-full shrink-0 items-center tracking-[-0.015em] ${column.primary ? "sticky left-9 z-30 bg-white" : "relative"}`}
    >
      {/* focus-within:after:absolute focus-within:after:inset-0 focus-within:after:block focus-within:after:rounded-sm focus-within:after:border-[0.5px] focus-within:after:border-slate-400 focus-within:after:border-solid */}
      <div className="relative h-full overflow-hidden rounded ring-slate-300 focus-within:shadow focus-within:ring-[0.5px]">
        {isSwitch ? (
          <div
            className={cn(
              "relative flex h-full w-32 cursor-default items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-none border-gray-100 border-r px-1 text-left text-inherit outline-none hover:bg-transparent focus-visible:ring-0",
              initialWidth,
            )}
          >
            <Switch
              className="mx-1.5"
              isSelected={plainValue === "Yes"}
              onChange={(val) => {
                saveValue(val ? "Yes" : "No")
              }}
            />
          </div>
        ) : (
          <Button
            onPress={() =>
              setEditing({
                editing: !!Editor,
                activeElement:
                  (document.activeElement as HTMLElement) ?? undefined,
              })
            }
            type="button"
            variant={"plain"}
            className={cn(
              "relative h-full w-32 cursor-default overflow-hidden text-ellipsis whitespace-nowrap rounded-none border-gray-100 border-r px-2 text-left text-inherit outline-none hover:bg-transparent focus-visible:ring-0",
              initialWidth,
            )}
          >
            {/* {nonReactElements.some(
            (type) => type === valueType && !Array.isArray(value),
          )
            ? isValidElement(value)
              ? value
              : null
            : value} */}
            {Array.isArray(value) ? value.join(", ") : value}
          </Button>
        )}
        {editable && editing && Editor ? (
          <AttributeValueEditor
            value={plainValue}
            close={saveValue}
            {...(activeElement ? { activeElement } : {})}
            configuration={column.configuration}
            Editor={Editor}
            field={
              {
                ...column.field,
                id: column.key,
                name: column.name,
              } satisfies AttributeField
            }
            cellId={cellId}
            attributeId={column.key as string}
            entity={name}
            type={column.type}
          />
        ) : (
          <motion.div layoutId={cellId} className="-z-10 absolute inset-0" />
        )}
      </div>
      {openButton && !editing ? (
        <button
          type="button"
          tabIndex={0}
          className="absolute right-2 box-content hidden h-5 rounded-md border border-gray-200 bg-white px-2 py-0 text-black text-xs leading-5 shadow-sm focus:inline-block group-focus-within/cell:inline-block group-hover/cell:inline-block"
          onClick={() => expand?.(data)}
        >
          Open
        </button>
      ) : null}
    </div>
  )
}

// const objectAtom = atom<Record<string, unknown>>({})
const Row = <T extends IRow = IRow>({
  data,
  columns,
  expand,
  getIdentifier,
  openButton,
  name,
  Icon,
  rowMenu,
}: {
  data: T
  // columns: GridProps<T>["columns"]
  index: number
  // expand: GridProps<T>["expand"]
  openButton?: object
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement
} & Pick<
  GridProps<T>,
  "expand" | "columns" | "getIdentifier" | "name" | "rowMenu"
>) => {
  // const { columns } = useContext(gridContext)

  return (
    <li className="group flex h-10 shrink-0 items-center border-gray-100 border-b border-solid">
      <div className="sticky left-0 z-30 shrink-0 bg-white">
        <Menu
          id={data.id}
          triggerButton={{
            className:
              "flex h-10 w-6 items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded-none border-none px-0 text-gray-400 leading-9 opacity-0 outline-none transition-opacity duration-100 hover:text-gray-600 focus:bg-slate-50 focus:text-gray-600 focus-visible:ring-0 group-focus-within:opacity-100 group-hover:opacity-100",
            children: <ThreeDotsHorizontal width={16} />,
          }}
          popover={{
            offset: 0,
          }}
          {...(rowMenu?.(data) ?? {})}
        />
      </div>

      <div className="sticky left-6 z-30 flex shrink-0 items-center bg-white">
        <Icon
          width={12}
          className="text-gray-400 opacity-100 transition-all duration-100 group-focus-within:text-black group-hover:text-black"
        />
      </div>
      {getIdentifier ? (
        <div className="inline-flex shrink-0 items-center justify-center">
          <Button
            onPress={() => expand?.(data)}
            type="button"
            variant={"plain"}
            className="group/button relative flex h-10 w-24 items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-none border border-transparent border-solid px-2 text-left font-light text-gray-500 text-xs leading-6 outline-none hover:bg-slate-50 focus:bg-slate-50 focus-visible:ring-0"
          >
            <span className="transition-opacity duration-200">
              {getIdentifier?.(data)}
            </span>
            <span className="ml-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus/button:opacity-100">
              <TransitionRight />
            </span>
          </Button>
        </div>
      ) : null}
      {columns.map((column, index) => {
        // Skip columns marked as hideInGrid
        if (column.hideInGrid) {
          return null
        }

        const columnData = data[column.key]
        return (
          <Cell
            key={column.key as string}
            value={
              column.transform
                ? column?.transform(columnData, { data })
                : columnData
            }
            plainValue={columnData}
            initialWidth={column.initialWidth}
            data={data}
            column={column}
            openButton={openButton && index === 0 ? {} : undefined}
            expand={expand}
            name={name}
          />
        )
      })}
    </li>
  )
}

const Column = <T extends IRow>({
  column,
  onColumnUpdate,
  entityType,
}: {
  column: DataGridColumn<T>
  onColumnUpdate: GridProps<T>["onColumnUpdate"]
  entityType: EntityType
}) => {
  const { columns = [], setColumns } = useDataGridContext()
  const { setSortColumns } = useViewContext()
  const api = useWorkspaceApi()
  const [editedName, setEditedName] = useState(column.name)
  const [opened, setOpened] = useState(false)
  const { setAppState } = useWorkspaceContext()
  const isEditable = column.type === "custom"
  const { dragProps } = useDrag({
    getItems: () => {
      return [{ "text/plain": String(column.key) }]
    },
  })
  const ref = useRef<HTMLDivElement>(null)
  const { isDropTarget, dropProps } = useDrop({
    ref,
    async onDrop(e) {
      if (!ref.current) return

      const { width } = ref.current.getBoundingClientRect()

      const [item] = e.items
      if (item?.kind === "text") {
        const key = await item.getText("text/plain")
        const columnIndex = columns.findIndex((c) => c.key === key)
        const dropIndex =
          columns.findIndex((c) => c.key === column.key) +
          Math.round(e.x / width)
        if (dropIndex === -1) return
        if (columnIndex === -1) return
        const min = Math.min(dropIndex, columnIndex)
        const max = Math.max(dropIndex, columnIndex)

        if (min === max) return

        const newColumns = [...columns]
        const droppedColumn = columns[columnIndex]
        if (droppedColumn) {
          if (dropIndex < columnIndex) {
            newColumns.splice(
              min,
              max - min + 1,
              ...(dropIndex < columnIndex ? [droppedColumn] : []),
              ...columns.slice(min, max),
            )
          } else {
            newColumns.splice(
              min,
              max - min + 1,
              ...columns.slice(min + 1, max + 1),
              ...(dropIndex > columnIndex ? [droppedColumn] : []),
            )
          }

          setColumns?.(newColumns)
        }
      }
    },
    onDropMove: (ev) => {
      if (!ref.current) return

      const { width } = ref.current.getBoundingClientRect()
      ref.current?.style.setProperty(
        "--drop-x",
        Math.round(ev.x / width).toString(),
      )
    },
    onDropEnter: () => {},
    onDropExit: () => {},
  })
  const configuration = column.configuration as
    | CreateAttributeRequestConfiguration
    | undefined
  const isSelect = column.field?.type === "Select"
  const isMultiSelect = !!configuration?.isMultiSelect

  return (
    <>
      <div
        ref={ref}
        className={`after:-translate-x-1/2 relative h-full shrink-0 overflow-hidden bg-white [--drop-x:0] after:absolute after:top-0 after:bottom-0 after:left-[calc(var(--drop-x)*100%)] after:w-2 after:transform after:bg-gray-500 after:opacity-0 after:transition-all after:duration-100 after:content-[''] ${isDropTarget ? "after:opacity-100" : ""}${column.primary ? " sticky left-9 z-[99999]" : ""}`}
        {...dragProps}
        {...dropProps}
      >
        <Menu
          triggerButton={{
            children: column.name,
            variant: "plain",
            className: cn(
              "relative h-full w-8 shrink-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-none border-gray-100 border-r border-solid px-2 text-left text-slate-500 ring-0 leading-9 outline-none focus:after:absolute focus:after:inset-0 focus:after:block focus:after:rounded-sm focus:after:border-[0.5px] focus:after:border-slate-400 focus:after:border-solid focus:ring-0 focus-visible:ring-0",
              column.initialWidth,
            ),
            onPress: () => setOpened(!opened),
          }}
          popover={{
            isOpen: opened,
            onOpenChange: async (opened) => {
              setOpened(opened)
              if (!opened && editedName.trim() !== column.name) {
                await onColumnUpdate({
                  column,
                  property: "name",
                  value: editedName,
                })
              }
            },
            children: (
              <Form
                onSubmit={async (ev) => {
                  ev.preventDefault()
                  if (editedName.trim() !== column.name) {
                    setOpened(false)
                    await onColumnUpdate({
                      column,
                      property: "name",
                      value: editedName,
                    })
                  }
                }}
                className="divide-y divide-gray-200"
              >
                {isEditable ? (
                  <div className="flex flex-col gap-y-1 p-1">
                    <TextFieldInput
                      className="h-6 leading-6"
                      value={editedName}
                      onChange={(ev) => {
                        setEditedName(ev.target.value)
                      }}
                    />
                    {/* <Button variant="plain" className="w-full p-2 py-1.5 text-left">
                Edit property
              </Button> */}
                  </div>
                ) : null}
                <div className="p-2">
                  <Button
                    variant="plain"
                    className="flex h-7 w-full items-center justify-between px-0 text-left leading-7 hover:bg-transparent"
                    onPress={() => {
                      setSortColumns?.([{ id: column.key, order: "desc" }])
                    }}
                  >
                    <span>Sort descending</span>
                    <ArrowLeft className="-rotate-90 text-gray-400" />
                  </Button>
                  <Button
                    variant="plain"
                    className="flex h-7 w-full items-center justify-between px-0 text-left leading-7 hover:bg-transparent"
                    onPress={() => {
                      setSortColumns?.([{ id: column.key, order: "asc" }])
                    }}
                  >
                    <span>Sort ascending</span>
                    <ArrowLeft className="rotate-90 text-gray-400" />
                  </Button>
                </div>
                <div className="flex flex-col gap-y-2 px-2 py-2">
                  {isSelect && column.type === "custom" ? (
                    <div className="gap-x-1">
                      <Label className="flex items-center text-inherit text-sm leading-6">
                        <span className="flex-1">Multi-select</span>
                        <Switch
                          isSelected={isMultiSelect}
                          onChange={(checked) => {
                            onColumnUpdate({
                              column,
                              property: "_configuration",
                              value: {
                                type: "Select",
                                ...configuration,
                                isMultiSelect: checked,
                              },
                            })
                          }}
                        />
                      </Label>
                    </div>
                  ) : null}
                  {isEditable ? (
                    <div className="flex flex-col gap-y-1">
                      <Button
                        variant="plain"
                        className="w-full px-0 text-left hover:bg-transparent"
                        onPress={() => {
                          setOpened(false)
                          setAppState((state) => {
                            return {
                              ...state,
                              confirmationModal: {
                                title: "Delete attribute",
                                description: `The attribute (${column.name}) will be deleted alongside its values for every row. This cannot be undone.`,
                                confirmButton: {
                                  children: "Delete",
                                  onPress: async () => {
                                    try {
                                      await api.attribute.deleteAttribute({
                                        id: column.key as string,
                                      })
                                    } catch (_) {
                                      if (_ instanceof ResponseError) {
                                        toast.error(
                                          (await _.response.json()).message,
                                          { duration: 1000 * 10 },
                                        )
                                      }
                                      return
                                    }
                                    await queryClient.invalidateQueries({
                                      queryKey: [
                                        api.attribute.getAttributes.name,
                                        entityType,
                                      ],
                                    })
                                    setAppState((state) => ({
                                      ...state,
                                      confirmationModal: null,
                                    }))
                                  },
                                },
                              },
                            }
                          })
                        }}
                      >
                        Delete attribute
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Form>
            ),
            className: "w-64",
          }}
        />
      </div>
    </>
  )
}

const DataGrid = <T extends IRow>({
  data,
  columns,
  setColumns,
  dontSupportsCustomFields = false,
  expand,
  name,
  onFieldUpdate,
  onColumnUpdate,
  getIdentifier,
  Icon = ID,
  rowMenu,
}: GridProps<T>) => {
  const attrs = useArrowNavigationGroup({
    axis: "grid-linear",
    circular: true,
    memorizeCurrent: true,
  })

  return (
    <DataGridContext.Provider
      value={{
        columns,
        setColumns,
        ...(onFieldUpdate ? { onFieldUpdate } : {}),
      }}
    >
      <motion.ol
        {...attrs}
        layout="position"
        className="flex flex-1 flex-col overflow-y-auto text-[13px] text-slate-800"
      >
        <li className="flex h-9 shrink-0 items-center border-gray-100 border-b border-solid">
          <div className="sticky left-0 z-30 shrink-0 bg-white">
            <Button
              type="button"
              variant={"plain"}
              className="h-9 w-6 shrink-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-none border-none px-2 text-center leading-[34px] outline-none focus:after:absolute focus:after:inset-0 focus:after:block focus:after:rounded-sm focus:after:border-[0.5px] focus:after:border-slate-400 focus:after:border-solid focus-visible:ring-0"
            />
          </div>
          <div className="sticky left-6 z-30 shrink-0 bg-white">
            <Icon
              width={12}
              className="text-gray-400 opacity-100 transition-all duration-100 group-focus-within:text-black group-hover:text-black"
            />
          </div>
          {getIdentifier ? (
            <Button
              type="button"
              variant={"plain"}
              className="relative h-full w-24 shrink-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-none border-none px-2 text-left font-light text-gray-500 leading-9 outline-none focus:after:absolute focus:after:inset-0 focus:after:block focus:after:rounded-sm focus:after:border focus:after:border-slate-400 focus:after:border-solid focus-visible:ring-0"
            >
              {name}
            </Button>
          ) : null}
          {columns
            .filter((column) => !column.hideInGrid)
            .map((column) => (
              <Column
                column={column}
                key={column.key as string}
                onColumnUpdate={onColumnUpdate}
                entityType={name}
              />
            ))}
          {!dontSupportsCustomFields ? (
            <CreateAttributePicker entityType={name} />
          ) : null}
        </li>
        {data.map((row, index) => {
          return (
            <Row
              key={`${row.id}`}
              data={row}
              columns={columns}
              index={index}
              name={name}
              Icon={Icon}
              {...(expand && { expand })}
              {...(getIdentifier && { getIdentifier })}
              {...(getIdentifier ? {} : { openButton: {} })}
              {...(rowMenu && { rowMenu })}
            />
          )
        })}
      </motion.ol>
    </DataGridContext.Provider>
  )
}

export default DataGrid

/**
 * Data -> Static/Dynamic
 * Keyboard navigation
 * Normalization
 * Virtualization
 *
 * Cache data at row level
 * useTable hook
 *
 */
