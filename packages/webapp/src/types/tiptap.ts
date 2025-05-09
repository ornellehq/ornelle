import type { Editor, Range } from "@tiptap/react"
import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion"

export interface RenderProps {
  onStart: (props: SuggestionProps) => void
  onUpdate: (props: SuggestionProps) => void
  onKeyDown: (props: SuggestionKeyDownProps) => boolean
  onExit: () => void
}

export interface BlockGroup {
  id: string
  name: string
  blocks: {
    id: string
    name: string
    onPress(args: {
      editor: Editor
      range: Range
      command(attrs: Record<string, unknown>): void
    }): void
  }[]
}
