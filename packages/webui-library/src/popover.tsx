import { motion } from "framer-motion"
import { Popover as AriaPopover } from "react-aria-components"
import { cn } from "./utils/cn"

const AriaMotionPopover = motion(AriaPopover)

interface PopoverProps extends React.ComponentProps<typeof AriaMotionPopover> {
  // className?: string
}

const Popover = ({
  children,
  className,
  ...props
}: React.PropsWithChildren<PopoverProps>) => {
  return (
    <AriaMotionPopover
      {...props}
      className={
        typeof className === "function"
          ? className
          : cn(
              "z-10 min-w-[var(--trigger-width)] rounded-lg border border-gray-100 border-solid bg-white shadow-lg",
              className,
            )
      }
      style={{
        zIndex: 10,
      }}
    >
      {children}
    </AriaMotionPopover>
  )
}

export default Popover
