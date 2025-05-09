import { useState } from "react"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import DialogTrigger from "webui-library/src/dialog-trigger"
import Add from "webui-library/src/icons/Add"
import CaretDown from "webui-library/src/icons/CaretDown"
import Trash from "webui-library/src/icons/Trash"
import ListBox from "webui-library/src/list-box"
import ListBoxItem from "webui-library/src/list-box-item"
import Popover from "webui-library/src/popover"
import { TextFieldInput } from "webui-library/src/text-field-input"
import Menu from "webui-library/src/widgets/menu"
import { textDataTypes } from "~/core/workspace/attributes/data"
import { useWorkspaceContext } from "~/core/workspace/workspace.context"
import { typeToOperatorsMap } from "~/lib/conditions"
import { useViewContext } from "../entity/view.context"
import FilterEditor from "./filter-editor"

const getDefaultValueForType = (type: string) => {
  if (textDataTypes.includes(type)) {
    return ""
  }

  switch (type) {
    case "Toggle":
      return false
    case "Date":
      return new Date().toISOString()
    case "Select":
      return ""
    case "Range":
      return { min: null, max: null }
    default:
      return null
  }
}

const FilterPicker = () => {
  const {
    refetch,
    setSelectedFilters: _setSelectedFilters,
    selectedFilters,
    filters,
    viewId,
    saveView,
    attributes,
    defaultSelectedFilters,
    updateViewConfig,
  } = useViewContext()
  const { appState, setAppState } = useWorkspaceContext()
  const hasFilters = filters.length > 0
  const [filterSearchTerm, setFilterSearchTerm] = useState("")
  const fitleredFilters =
    filterSearchTerm.trim() !== ""
      ? filters.filter(({ name }) =>
          name.toUpperCase().includes(filterSearchTerm.toUpperCase()),
        )
      : filters
  const [opened, setOpened] = useState(false)
  const [openedFilterId, setOpenedFilterId] = useState<null | string>(null)
  const setSelectedFilters: typeof _setSelectedFilters = (data) => {
    const filters = typeof data === "function" ? data(selectedFilters) : data
    _setSelectedFilters(filters)
    refetch()
  }
  const inNewView = appState.entityView === "new"
  const onCreateView = async () => {
    if (inNewView) {
      await saveView(true)
    } else {
      setAppState((state) => ({ ...state, entityView: "new" }))
    }
  }

  return (
    <div className="flex flex-1 items-center pl-2">
      <div className="flex flex-1 items-center">
        {selectedFilters.length ? (
          <div className="mr-2 flex items-center gap-x-1 overflow-x-auto p-1">
            {selectedFilters.map((selected) => {
              const { id, operator, value } = selected
              const filter = filters.find((filter) => filter.id === id)

              if (!filter) return null

              const remove = () => {
                const newFilters = selectedFilters.filter(
                  (selected) => selected.id !== id,
                )
                setSelectedFilters(newFilters)
              }

              return (
                <div
                  key={id}
                  className="flex h-[22px] items-center divide-x divide-gray-100 rounded-lg border border-gray-200 px-1.5 leading-[22px] outline-none focus:ring-2 focus:ring-gray-100"
                >
                  <Menu
                    key={id}
                    triggerButton={{
                      className:
                        "h-5 leading-5 flex items-center pr-0.5 rounded-none hover:bg-transparent",
                      children: (
                        <>
                          <span className="mr-1">{filter.name}</span>
                          <CaretDown width={10} />
                        </>
                      ),
                      onPress: () => setOpenedFilterId(id),
                    }}
                    popover={{
                      isOpen: openedFilterId === id,
                      onOpenChange: (isOpen) =>
                        setOpenedFilterId(openedFilterId === id ? null : id),
                      className: "shadow-none",
                      children: (
                        <FilterEditor
                          value={value}
                          filter={filter}
                          operator={operator}
                          remove={remove}
                          setValue={(value) => {
                            const newFilters = selectedFilters.map((item) =>
                              item.id === id ? { ...item, value } : item,
                            )
                            setSelectedFilters(newFilters)
                            // onChange(newFilters)
                          }}
                          close={() => setOpenedFilterId(null)}
                          setOperator={(operator) => {
                            const newFilters = selectedFilters.map((item) =>
                              item.id === id ? { ...item, operator } : item,
                            )
                            setSelectedFilters(newFilters)
                            // onChange(newFilters)
                          }}
                          config={
                            attributes.find(
                              (attribute) => attribute.id === filter.id,
                            )?._configuration
                          }
                        />
                      ),
                    }}
                  />
                  <Button
                    variant="plain"
                    className="rounded-none pl-1 text-red-800"
                    onPress={remove}
                  >
                    <Trash width={11} />
                  </Button>
                </div>
              )
            })}
          </div>
        ) : null}
        <DialogTrigger>
          <Button
            variant={"plain"}
            className="flex h-6 w-auto items-center gap-x-1 rounded-md border border-[#ECEDEF] px-1.5 shadow-[0px_1px_2px_rgba(0,0,0,0.1)]"
            onPress={() => setOpened(true)}
          >
            <Add width={13} height={13} className="text-purpleX11" />
            <span>Add a filter</span>
          </Button>
          <Popover
            placement="bottom left"
            isOpen={opened}
            onOpenChange={setOpened}
          >
            <Dialog>
              {hasFilters ? (
                <>
                  <TextFieldInput
                    autoFocus
                    value={filterSearchTerm}
                    onChange={(ev) => {
                      setFilterSearchTerm(ev.target.value)
                    }}
                    placeholder="Filter..."
                    className="h-11 rounded-none border-gray-100 border-x-0 border-t-0 border-b bg-transparent outline-none placeholder:text-gray-400"
                  />
                  <ListBox className="block max-h-96 min-w-52 overflow-y-auto p-1">
                    {fitleredFilters
                      .filter((filter) =>
                        selectedFilters.every((item) => item.id !== filter.id),
                      )
                      .map(({ id, name, icon, type, defaultOperator }) => {
                        const operator =
                          defaultOperator ?? typeToOperatorsMap[type][0]
                        return (
                          <ListBoxItem
                            key={id}
                            id={id}
                            className="flex h-8 items-center gap-x-2 rounded-md px-2 leading-8 outline-none hover:bg-slate-50 focus:bg-slate-50"
                            onAction={() => {
                              const newFilters = [
                                ...selectedFilters,
                                {
                                  id,
                                  value: getDefaultValueForType(type),
                                  operator: operator ?? "in",
                                },
                              ]
                              setSelectedFilters(newFilters)
                              setOpened(false)
                              setOpenedFilterId(id)
                              // onChange(newFilters)
                            }}
                          >
                            {/* <span className="text-slate-600">
                        {icon ?? <IntersectMinusBack />}
                      </span> */}
                            <span>{name}</span>
                          </ListBoxItem>
                        )
                      })}
                  </ListBox>
                </>
              ) : (
                <div className="flex h-20 w-56 items-center justify-center overflow-y-auto rounded-md p-1 text-gray-400">
                  <span>No filters available</span>
                </div>
              )}
            </Dialog>
          </Popover>
        </DialogTrigger>
      </div>
      {JSON.stringify(
        selectedFilters.map((filter) => ({ ...filter, options: [] })),
      ) !==
      JSON.stringify(
        (defaultSelectedFilters ?? []).map((filter) => ({
          ...filter,
          options: [],
        })),
      ) ? (
        <div className="flex items-center gap-x-3">
          {inNewView ? (
            <Button
              variant="plain"
              className="rounded-md bg-gray-200 px-1"
              onPress={() =>
                setAppState((state) => ({ ...state, entityView: "default" }))
              }
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="plain"
              className="px-1"
              onPress={() => setSelectedFilters(defaultSelectedFilters ?? [])}
            >
              {defaultSelectedFilters ? "Reset" : "Clear"}
            </Button>
          )}
          {viewId && !inNewView ? (
            <Menu
              triggerButton={{
                children: (
                  <>
                    <span>Save</span>
                    <CaretDown width={12} />
                  </>
                ),
                className:
                  "h-5 flex items-center overflow-hidden rounded-md bg-gray-200 px-2 leading-5",
              }}
              popover={{
                placement: "bottom right",
              }}
              items={[
                {
                  id: "save-to-view",
                  children: "Save to this view",
                  onAction: updateViewConfig,
                  // onAction: async () => {
                  //   await api.view.updateView({
                  //     id: viewId,
                  //     updateViewRequest: {
                  //       config: { filters: selectedFilters },
                  //     },
                  //   })
                  //   router.invalidate()
                  //   queryClient.invalidateQueries({
                  //     queryKey: [api.view.getView.name, viewId],
                  //   })
                  // },
                },
                {
                  id: "create-view",
                  children: "Create a new view",
                  onAction: () =>
                    setAppState((state) => ({ ...state, entityView: "new" })),
                },
              ]}
            />
          ) : (
            <Button
              variant={inNewView ? "elevated" : "plain"}
              className="h-5 overflow-hidden rounded-md bg-gray-200 px-2 leading-5"
              onPress={onCreateView}
            >
              Save
            </Button>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default FilterPicker
