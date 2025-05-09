import { type VariantProps, cva } from "class-variance-authority"
import { motion } from "framer-motion"
import { forwardRef } from "react"
import { Button as AriaButton } from "react-aria-components"
import { cn } from "./utils/cn"

const buttonVariants = cva(
  "rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 outline-none focus:outline-none focus:ring-2",
  {
    variants: {
      variant: {
        default: "h-[--spacing-9] bg-purpleX11 text-white",
        plain:
          "rounded-md bg-transparent text-black hover:bg-slate-50 focus-visible:ring-0 focus:ring-0",
        elevated:
          "h-[--spacing-9] shadow-[0px_3px_0.3px_#0A68FF] bg-[linear-gradient(#3381FF,_#478EFF)] text-white rounded-md leading-[calc(var(--spacing-9)+2px)] hover:bg-[linear-gradient(#0A68FF,#478EFF)] active:shadow-[0px_2px_0.3px_#0A68FF]",
        attributeValue:
          "block h-9 flex-1 rounded px-2 text-left leading-9 hover:bg-gray-50",
      },
      size: {
        default: "",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

const MotionAriaButton = motion(AriaButton)

interface ButtonProps
  extends Omit<React.ComponentProps<typeof MotionAriaButton>, "className">,
    VariantProps<typeof buttonVariants> {
  className?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size, variant, className, ...props }, ref) => (
    <MotionAriaButton
      {...props}
      ref={ref}
      className={cn(buttonVariants({ size, variant, className }))}
    />
  ),
)

export default Button
