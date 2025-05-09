import { GridList as AriaGridList } from "react-aria-components"

interface GridListProps
  extends Omit<React.ComponentProps<typeof AriaGridList>, "className"> {
  className?: string
}

const GridList = ({
  children,
  ...props
}: React.PropsWithChildren<GridListProps>) => {
  return <AriaGridList {...props}>{children}</AriaGridList>
}

export default GridList
