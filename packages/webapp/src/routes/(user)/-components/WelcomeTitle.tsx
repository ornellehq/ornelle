import type { HTMLMotionProps } from "framer-motion"
import { motion } from "framer-motion"
import type { PropsWithChildren } from "react"
import { cn } from "webui-library/src/utils/cn"

const WelcomeTitle = ({
  children,
  ...props
}: PropsWithChildren<object> & HTMLMotionProps<"div">) => {
  return (
    <motion.div
      layoutId="Welcome title"
      layout="position"
      {...props}
      className={cn("mb-6 font-medium text-2xl", props.className)}
    >
      {children}
    </motion.div>
  )
}

export default WelcomeTitle
