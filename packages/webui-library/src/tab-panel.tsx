import type { ComponentProps } from "react"
import { TabPanel as AriaTabPanel } from "react-aria-components"
import { cn } from "./utils/cn"

interface Props extends Omit<ComponentProps<typeof AriaTabPanel>, "className"> {
  className?: string
}

const TabPanel = ({ className, ...props }: Props) => {
  return <AriaTabPanel {...props} className={cn("", className)} />
}

export default TabPanel
