import { useLayoutEffect } from "react"
import type { CellEditingComponent } from "./types"

interface Props extends React.ComponentProps<CellEditingComponent> {
  Editor: CellEditingComponent
  activeElement?: HTMLElement
}

const DumbComponent = (props: Props) => {
  return (
    <div className="absolute inset-0 flex">
      <props.Editor {...props} />
    </div>
  )
}

export const AttributeValueEditorWithFocus = (props: Props) => {
  useLayoutEffect(() => {
    const abortController = new AbortController()
    window.addEventListener(
      "keydown",
      (ev) => {
        if (ev.key === "Escape" || (ev.key === "Enter" && !ev.shiftKey)) {
          // close()
          document.activeElement?.blur?.()
          props.activeElement?.focus()
        }
      },
      { signal: abortController.signal },
    )

    return () => abortController.abort()
  }, [props.activeElement])

  return <DumbComponent {...props} />
}

const AttributeValueEditor = (props: Props) => {
  return <DumbComponent {...props} />
}

export default AttributeValueEditor
