import { useArrowNavigationGroup } from "@fluentui/react-tabster"
import { Extension } from "@tiptap/react"
import { Suggestion, type SuggestionOptions } from "@tiptap/suggestion"
import { type Root, createRoot } from "react-dom/client"
import { Button } from "webui-library/src/button"
import Popover from "webui-library/src/popover"
import type { BlockGroup, RenderProps } from "~/types/tiptap"

export const SlashCommandExtension = Extension.create({
  name: "slash-command",
  // group: "inline",
  // inline: true,
  // selectable: false,
  // atom: true,
  addOptions(): { suggestion: Omit<SuggestionOptions, "editor"> } {
    return {
      // renderLabel({ options, node }) {
      //   return `@${node.attrs.label ?? ""}`
      // },
      suggestion: {
        char: "/",
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
      },
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

export const useSlashCommandExtension = ({
  blocks: blockGroups,
}: { blocks: BlockGroup[] }) => {
  const attrs = useArrowNavigationGroup({
    axis: "vertical",
    circular: true,
  })

  return SlashCommandExtension.configure({
    suggestion: {
      items: () => {
        return []
      },
      render: (): RenderProps => {
        const posEl = document.createElement("div")
        let root: Root | undefined = undefined
        return {
          onStart: ({ clientRect: getClientRect, range, editor }) => {
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
                  className="flex max-h-[35rem] w-56 flex-col gap-y-3 overflow-y-auto p-2"
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
                                  className="h-8 w-full px-2 text-left text-sm leading-8"
                                  onPress={() =>
                                    block.onPress({ editor, range })
                                  }
                                  // onPress={() => {
                                  //   switch (block.id) {
                                  //     case "openings":
                                  //       editor
                                  //         .chain()
                                  //         .focus()
                                  //         .deleteRange(range)
                                  //         .createParagraphNear()
                                  //         .insertContent({
                                  //           type: "openings",
                                  //           attrs: {},
                                  //         })
                                  //         .createParagraphNear()
                                  //         .run()
                                  //       editor.view.dispatch(
                                  //         editor.view.state.tr,
                                  //       )
                                  //       break

                                  //     default:
                                  //       break
                                  //   }
                                  // }}
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
