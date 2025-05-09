import type { ComponentProps } from "react"
import { TabList as AriaTabList } from "react-aria-components"
import { cn } from "./utils/cn"

interface Props extends Omit<ComponentProps<typeof AriaTabList>, "className"> {
  className?: string
}

const TabList = ({ className, ...props }: Props) => {
  return <AriaTabList {...props} className={cn("", className)} />
}

export default TabList
