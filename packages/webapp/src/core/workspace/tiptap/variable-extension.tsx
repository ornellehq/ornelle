import { useArrowNavigationGroup } from "@fluentui/react-tabster"
import { Node, mergeAttributes } from "@tiptap/react"
import { Suggestion, type SuggestionOptions } from "@tiptap/suggestion"
import { type Root, createRoot } from "react-dom/client"
import { Button } from "webui-library/src/button"
import Popover from "webui-library/src/popover"
import type { BlockGroup, RenderProps } from "~/types/tiptap"

export const VariableTiptapExtension = Node.create({
  name: "template-variable",
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,
  addOptions(): { suggestion: Omit<SuggestionOptions, "editor"> } {
    return {
      // renderLabel({ options, node }) {
      //   return `@${node.attrs.label ?? ""}`
      // },
      suggestion: {
        char: ":",
        command: ({ editor, range, props }) => {
          // Delete the @ character and insert mention
          return editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent([
              {
                type: "template-variable",
                attrs: props,
              },
              // {
              //   type: "text",
              //   text: " ",
              // },
            ])
            .run()
        },
        // allow: ({ editor, range }) => {
        //   return editor.can().deleteRange(range)
        // },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: "span[data-variable]",
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        {
          ...HTMLAttributes,
          "data-variable": node.attrs.id,
          class: "template-variable",
        },
        HTMLAttributes,
      ),
      `{{${node.attrs.label}}}`,
    ]
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {}
          }
          return {
            "data-id": attributes.id,
          }
        },
      },
      label: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-label"),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {}
          }
          return {
            "data-label": attributes.label,
          }
        },
      },
      entity: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-entity"), // Application, Candidate, Opening, Role, Meeting
        renderHTML: (attributes) => {
          if (!attributes.entity) {
            return {}
          }
          return {
            "data-entity": attributes.entity,
          }
        },
      },
      type: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-type"),
        renderHTML: (attributes) => {
          if (!attributes.type) {
            return {}
          }
          return {
            "data-type": attributes.type,
          }
        },
      },
    }
  },
})

export const useConfiguredVariableTiptapExtension = ({
  blocks: blockGroups,
}: { blocks: BlockGroup[] }) => {
  const attrs = useArrowNavigationGroup({
    axis: "vertical",
    circular: true,
  })

  return VariableTiptapExtension.configure({
    suggestion: {
      items: ({ query }) => {
        return []
      },
      render: (): RenderProps => {
        const posEl = document.createElement("div")
        let root: Root | undefined = undefined
        return {
          onStart: ({ clientRect: getClientRect, range, editor, command }) => {
            const clientRect = getClientRect?.()
            if (!clientRect) return

            document.body.append(posEl)

            posEl.style.position = "absolute"
            posEl.style.left = `${clientRect.left}px`
            posEl.style.top = `${clientRect.top + 24}px`

            root = createRoot(posEl)
            root?.render(
              <Popover
                isOpen={true}
                // onOpenChange={() => {
                //   editor.chain().deleteRange(range).run()
                // }}
                triggerRef={{ current: posEl }}
                placement="bottom left"
                isNonModal={true}
                shouldUpdatePosition
              >
                <div
                  {...attrs}
                  className="flex max-h-[min(35rem,_75vh)] w-56 flex-col gap-y-3 overflow-y-auto p-2"
                >
                  {blockGroups.map(({ id, name, blocks }) => {
                    return (
                      <div key={id}>
                        <div className="mb-1 px-2 text-gray-500 text-xs">
                          {name}
                        </div>
                        <ul>
                          {blocks.map((block) => {
                            return (
                              <li key={block.id}>
                                <Button
                                  variant="plain"
                                  className="h-8 w-full px-2 text-left text-[13px] leading-8"
                                  onPress={() =>
                                    block.onPress({ editor, range, command })
                                  }
                                >
                                  {block.name}
                                </Button>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </Popover>,
            )
          },
          onUpdate() {},
          onKeyDown() {
            return false
          },
          onExit() {
            root?.unmount()
            document.body.removeChild(posEl)
          },
        }
      },
    },
  })
}
// export const SlashVariable = Node.create({
//   name: "Slash variable",
//   group: "inline",
//   inline: true,
//   selectable: false,
//   atom: true,
//   addOptions() {
//     return {
//       HTMLAttributes: {},
//     }
//   },
//   addAttributes() {
//     return {
//       id: {
//         default: null,
//       },
//       label: {
//         default: null,
//       },
//     }
//   },
//   parseHTML() {
//     return [
//       {
//         tag: "span[data-variable]",
//       },
//     ]
//   },
//   renderHTML({ HTMLAttributes }) {
//     return [
//       "span",
//       mergeAttributes({ "data-variable": "" }, HTMLAttributes),
//       `@${HTMLAttributes.label}`,
//     ]
//   },
//   addNodeView() {
//     return ({ node }) => {
//       const span = document.createElement("span")
//       span.className = "mention"
//       span.textContent = `@${node.attrs.label}`
//       return {
//         dom: span,
//       }
//     }
//   },
//   addKeyboardShortcuts() {
//     return {
//       Enter: () => this.editor.commands.exitCode(),
//     }
//   },
// })
