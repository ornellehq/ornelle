import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import type { EditorProps } from "@tiptap/pm/view"
import {
  type Content,
  type Editor,
  EditorProvider,
  type EditorProviderProps,
  type Extension,
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { forwardRef, useMemo } from "react"
import { cn } from "../../utils/cn"
import "./styles.css"

// define your extension array

const content = ""

const container = document.createElement("main")
container.setAttribute("className", "outline-none")

interface Props extends EditorProviderProps {
  onChange?(data: { html: string; json: object }): void
  editable?: boolean
  defaultContent?: Content
  editorProps?: EditorProps<unknown>
  extensions?: Extension<object>[]
  placeholder?: string
}

const RTE = forwardRef<Editor, Props>(
  (
    {
      onChange,
      editable = true,
      defaultContent,
      editorProps,
      extensions: argExtensions = [],
      placeholder = "Write here",
      ...props
    },
    ref,
  ) => {
    const defaultExtensions = useMemo(
      () => [
        StarterKit.configure({}),
        Placeholder.configure({ placeholder }),
        Image.configure({}),
      ],
      [placeholder],
    )

    // @ts-ignore
    const extensions: Extension<object>[] = useMemo(
      () => [...defaultExtensions, ...argExtensions],
      [argExtensions, defaultExtensions],
    )

    // useImperativeHandle(
    //   ref,
    //   () => ({
    //     editor: editorRef.current,
    //     setContent: (content: Content) => {
    //       if (editorRef.current) {
    //         editorRef.current.commands.setContent(content)
    //       }
    //     },
    //   }),
    //   [editorRef.current],
    // )

    return (
      <EditorProvider
        extensions={extensions}
        content={defaultContent ?? content}
        // element={container}
        editable={editable}
        editorProps={{
          ...editorProps,
          attributes: {
            ...editorProps?.attributes,
            class: cn(
              "min-h-24 prose prose-sm prose-li:leading-snug prose-p:leading-snug prose-p:my-2 focus:outline-none",
              (editorProps?.attributes as { class: string })?.class,
            ),
          },
        }}
        onUpdate={({ editor, transaction }) => {
          onChange?.({ html: editor.getHTML(), json: editor.getJSON() })
        }}
        onCreate={({ editor }) => {
          if (ref) {
            if (typeof ref === "function") {
              ref(editor)
            } else {
              ref.current = editor
            }
          }
        }}
        {...props}
      >
        {/* <FloatingMenu editor={null}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={null}>This is the bubble menu</BubbleMenu> */}
      </EditorProvider>
    )
  },
)

export default RTE
