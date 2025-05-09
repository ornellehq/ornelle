import type { ComponentProps } from "react"
import { Tabs as AriaTabs } from "react-aria-components"
import { cn } from "./utils/cn"

interface Props extends Omit<ComponentProps<typeof AriaTabs>, "className"> {
  className?: string
}

const Tabs = ({ className, ...props }: Props) => {
  return <AriaTabs {...props} className={cn("cursor-pointer", className)} />
}

export default Tabs
