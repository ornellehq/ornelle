import { GridListItem as AriaGridListItem } from "react-aria-components"

interface GridListItemProps
  extends Omit<React.ComponentProps<typeof AriaGridListItem>, "className"> {
  className?: string
}

const GridListItem = ({
  children,
  ...props
}: React.PropsWithChildren<GridListItemProps>) => {
  return <AriaGridListItem {...props}>{children}</AriaGridListItem>
}

export default GridListItem
