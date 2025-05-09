import { useQuery } from "@tanstack/react-query"
import { NodeViewWrapper } from "@tiptap/react"
import {
  type GetAttributes200ResponseInner,
  GetAttributes200ResponseInnerDataTypeEnum,
  GetAttributesEntityTypesEnum,
} from "sdks/src/server-sdk"
import CaretDown from "webui-library/src/icons/CaretDown"
import Dropdown from "webui-library/src/widgets/dropdown"
import Menu from "webui-library/src/widgets/menu"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import type { NodeViewRendererProps } from "~/core/workspace/tiptap/types"
import type { Opening } from "~/types/entities"

const noValueSymbol = Symbol("No attribute value symbol")

const EditorOpenings = (
  props: NodeViewRendererProps<{
    openings: []
    filters: object
    groupBy: null | string
    propertiesToShow: string[] | null
  }>,
) => {
  const {
    updateAttributes,
    node: { attrs },
  } = props
  const api = useWorkspaceApi()
  const { data: openings = [] } = useQuery({
    queryKey: [api.opening.getOpenings.name],
    queryFn: async () =>
      api.opening.getOpenings({ include: { h: "" }, sorts: [] }),
  })
  const { data: attributes } = useEntityAttributes([
    GetAttributesEntityTypesEnum.Opening,
    GetAttributesEntityTypesEnum.Role,
  ])
  const selectAttributes = attributes.filter(
    (attribute) =>
      attribute.dataType === GetAttributes200ResponseInnerDataTypeEnum.Select,
  )
  const groupByAttribute = attributes.find(
    (attribute) => attribute.id === attrs.groupBy,
  )
  // @ts-ignore
  const groupedOpenings: Record<
    string,
    { id: string; name: string; openings: Opening[] }
  > = groupByAttribute
    ? openings.reduce((acc, opening) => {
        const value =
          // @ts-ignore
          opening[groupByAttribute.id] ?? opening.role[groupByAttribute.id]

        if (value) {
          return {
            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
            ...acc,
            [value]: {
              id: value,
              name: value,
              // @ts-ignore
              openings: [...(acc[value]?.openings ?? []), opening],
            },
          }
        }

        return {
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...acc,
          [noValueSymbol]: {
            id: noValueSymbol,
            name: "",
            // @ts-ignore
            openings: [...(acc[noValueSymbol]?.openings ?? []), opening],
          },
        }
      }, {})
    : { all: { id: "all", name: "All", openings } }
  const selectedAttributes = (attrs.propertiesToShow
    ?.map((id) => {
      const attribute = attributes.find((attribute) => attribute.id === id)
      return attribute
    })
    .filter(Boolean) ?? []) as GetAttributes200ResponseInner[]

  return (
    <NodeViewWrapper>
      <div className="group relative hover:bg-gray-100 hover:shadow-smallBottom ">
        {/* <div className="-translate-x-full absolute top-2 left-0 hidden transform group-hover:block">
          <Button
            variant="plain"
            className="inline-flex items-center justify-center p-1 text-xs leading-5"
          >
            <Settings01 />
          </Button>
        </div> */}
        {/* <Button variant="plain" className="block w-full text-left"></Button> */}
        <Menu
          triggerButton={{
            className: "w-full text-left flex flex-col gap-y-2",
            children: (
              <>
                {Object.values(groupedOpenings).map(
                  ({ openings, name, id }) => {
                    return (
                      <div key={id}>
                        {groupByAttribute ? (
                          <div className="text-gray-400 text-xs">
                            {name}{" "}
                            <span className=" align-super">
                              {openings.length}
                            </span>{" "}
                          </div>
                        ) : null}
                        {openings.map((opening) => {
                          const { id, title } = opening

                          return (
                            <div key={id} className="flex items-center py-2">
                              <span className="mr-2">{title}</span>
                              <span className="text-gray-400 text-xs">
                                {selectedAttributes
                                  .map(({ id }) => {
                                    const value =
                                      opening[id] ?? opening.role[id]
                                    return value
                                  })
                                  .filter(Boolean)
                                  .join(" • ")}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )
                  },
                )}
              </>
            ),
          }}
          popover={{
            placement: "left top",
            className:
              "p-3 w-96 flex flex-col gap-y-3 shadow-none border border-gray-200",
            children: (
              <>
                <div className="flex items-center justify-between">
                  <div>Group by</div>
                  <div className="">
                    <Dropdown
                      selectedKey={attrs.groupBy}
                      className="min-w-36"
                      onSelectionChange={(key) => {
                        const id = key as string

                        updateAttributes({
                          ...attrs,
                          groupBy: id === "none" ? null : id,
                        })
                      }}
                      items={[
                        {
                          id: "none",
                          children: "None",
                        },
                        ...selectAttributes.map(({ id, name }) => ({
                          id,
                          children: name,
                        })),
                      ]}
                    />
                  </div>
                </div>
                {/* <div className="flex items-center justify-between">
                  <div>Filters</div>
                  <div className="">
                    <Menu
                      selectionMode="multiple"
                      triggerButton={{
                        className:
                          "min-w-36 flex h-8 items-center rounded-md border border-gray-200 px-2 leading-8 text-left",
                        children: (
                          <>
                            <span className="flex-1">Select</span>
                            <CaretDown />
                          </>
                        ),
                      }}
                      items={[
                        {
                          id: "none",
                          children: "None",
                        },
                        ...selectAttributes.map(({ id, name, entityType }) => ({
                          id,
                          children: (
                            <>
                              <span>{name}</span>
                              <span className="h-4 rounded-full bg-gray-100 px-1 text-xs capitalize leading-4">
                                {entityType.toLowerCase()}
                              </span>
                            </>
                          ),
                        })),
                      ]}
                    />
                  </div>
                </div> */}
                <div className="flex items-center justify-between">
                  <div className="mr-4 shrink-0 leading-none">
                    <div>Properties to show</div>
                    <div className="mt-0.5 text-[11px] text-gray-400">
                      At most 3
                    </div>
                  </div>
                  <div className="flex flex-1 justify-end overflow-hidden">
                    <Menu
                      selectedKeys={attrs.propertiesToShow ?? []}
                      selectionMode="multiple"
                      triggerButton={{
                        className:
                          "min-w-36 max-w-full flex h-8 items-center rounded-md border border-gray-200 px-2 leading-8 text-left",
                        children: (
                          <>
                            {attrs.propertiesToShow?.length ? (
                              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                {selectedAttributes
                                  .map(({ name }) => name)
                                  .join(", ")}
                              </span>
                            ) : (
                              <span className="flex-1">Select</span>
                            )}
                            <CaretDown />
                          </>
                        ),
                      }}
                      items={attributes.map(({ id, name }) => {
                        const selected = !!attrs.propertiesToShow?.includes(id)

                        return {
                          id,
                          children: name,
                          onAction: () => {
                            updateAttributes({
                              ...attrs,
                              propertiesToShow: selected
                                ? attrs.propertiesToShow?.filter(
                                    (_id) => _id !== id,
                                  ) ?? []
                                : [...(attrs.propertiesToShow ?? []), id].slice(
                                    -3,
                                  ),
                            })
                          },
                        }
                      })}
                    />
                  </div>
                </div>
              </>
            ),
          }}
        />
      </div>
    </NodeViewWrapper>
  )
}

export default EditorOpenings

/**
 * Group by, show filters
 */
