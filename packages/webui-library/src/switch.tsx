import type { PropsWithChildren } from "react"
import { Switch as AriaSwitch } from "react-aria-components"
import { cn } from "./utils/cn"

interface SwitchProps
  extends Omit<React.ComponentProps<typeof AriaSwitch>, "className"> {
  className?: string
}

export const Switch = ({
  children,
  ...props
}: PropsWithChildren<SwitchProps>) => (
  <AriaSwitch
    {...props}
    className={cn(
      "group flex cursor-pointer items-center gap-2 font-semibold text-black text-lg",
      props.className,
    )}
  >
    <div className="box-border flex h-5 w-[34px] shrink-0 cursor-default rounded-full border border-white/30 border-solid bg-blue-300 bg-clip-padding p-[2px] shadow-inner outline-none ring-black transition duration-200 ease-in-out group-focus-visible:ring-2 group-selected:group-pressed:contrast-125 group-selected:bg-purpleX11 group-pressed:contrast-125">
      <span className="h-[14px] w-[14px] translate-x-0 transform rounded-full bg-white shadow transition duration-200 ease-in-out group-selected:translate-x-[100%]" />
    </div>
    {children}
  </AriaSwitch>
)
