export interface NodeViewRendererProps<Attributes extends object> {
  node: {
    type: "openings"
    attrs: Attributes
  }
  updateAttributes: (attrs: Record<string, unknown>) => void
}
