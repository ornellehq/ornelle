import type { Editor, Range } from "@tiptap/react"

export const insertOpenings = ({
  editor,
  range,
}: { editor: Editor; range: Range }) => {
  editor
    .chain()
    .focus()
    .deleteRange(range)
    .createParagraphNear()
    .insertContent({
      type: "openings",
      attrs: {},
    })
    .createParagraphNear()
    .run()
  return editor.view.dispatch(editor.view.state.tr)
}
