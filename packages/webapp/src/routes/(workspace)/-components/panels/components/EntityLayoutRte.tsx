import { type ComponentProps, useState } from "react"
import CaretRight from "webui-library/src/icons/CaretRight"
import RTE from "webui-library/src/widgets/rte"

interface EntityLayoutRteProps extends ComponentProps<typeof RTE> {
  html: string
  label?: string
}

const EntityLayoutRte = ({
  html,
  label = "Description",
  ...props
}: EntityLayoutRteProps) => {
  const [view, updateView] = useState<{ expandedDescription: boolean }>({
    expandedDescription: false,
  })

  return (
    <div className="relative px-6 py-2">
      <button
        onClick={() => {
          updateView((view) => ({
            ...view,
            expandedDescription: !view.expandedDescription,
          }))
        }}
        className="static mb-4"
        type="button"
      >
        <h3 className="flex items-center gap-x-1 text-gray-400">
          <span>{label}</span>
          <CaretRight
            width={12}
            className={`transition duration-150 ${view.expandedDescription ? "rotate-90" : ""}`}
          />
        </h3>
        {view.expandedDescription ? null : (
          <div className="absolute inset-0 z-10" />
        )}
      </button>
      <div
        className={`prose-headings:text-gray-600 text-gray-600 ${view.expandedDescription ? "" : "line-clamp-6 overflow-hidden text-ellipsis [mask-image:_linear-gradient(#fff,_transparent)]"}`}
      >
        <RTE
          {...props}
          defaultContent={html}
          editorProps={{
            ...props.editorProps,
            attributes: view.expandedDescription
              ? { ...props.editorProps?.attributes }
              : { ...props.editorProps?.attributes, tabIndex: "-1" },
          }}
        />
      </div>
    </div>
  )
}

export default EntityLayoutRte
