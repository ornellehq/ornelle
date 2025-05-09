import { Node, ReactNodeViewRenderer, mergeAttributes } from "@tiptap/react"
import EditorOpenings from "~/routes/(workspace)/-components/editor/editor-openings"

const OpeningsExtension = Node.create({
  name: "openings",
  group: "block",
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      openings: [],
      filters: {},
      groupBy: null,
    }
  },

  addAttributes() {
    return {
      groupBy: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-group-by") ?? "",
        renderHTML: (attributes) => {
          if (!attributes.groupBy) {
            return {}
          }
          return {
            "data-group-by": attributes.groupBy,
          }
        },
      },
      propertiesToShow: {
        default: [],
        parseHTML: (element) => {
          try {
            const str = element.getAttribute("data-properties")
            if (str) return JSON.parse(str)
          } catch (err) {}
          return []
        },
        renderHTML: (attributes) => {
          if (!attributes.propertiesToShow) {
            return {}
          }
          return {
            "data-properties": JSON.stringify(attributes.propertiesToShow),
          }
        },
      },
      // options: {
      //   default: {
      //     openings: [],
      //     filters: {},
      //     groupBy: null,
      //   },
      // },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[data-openings]",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-openings": "" })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EditorOpenings)
  },
})

export default OpeningsExtension
