import type { ComponentProps } from "react"
import { Tab as AriaTab } from "react-aria-components"
import { cn } from "./utils/cn"

interface Props extends Omit<ComponentProps<typeof AriaTab>, "className"> {
  className?: string
}

const Tab = ({ className, ...props }: Props) => {
  return <AriaTab {...props} className={cn("", className)} />
}

export default Tab
