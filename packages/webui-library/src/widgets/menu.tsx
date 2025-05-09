import type { FunctionComponent } from "react"
import { Menu as AriaMenu, MenuItem, MenuTrigger } from "react-aria-components"
import { Button } from "../button"
import Popover from "../popover"
import { cn } from "../utils/cn"

interface Props extends React.ComponentProps<typeof AriaMenu> {
  triggerButton: React.ComponentProps<typeof Button>
  items?: React.PropsWithChildren<
    Omit<React.ComponentProps<typeof MenuItem>, "className" | "children"> & {
      className?: string
      Icon?: FunctionComponent<React.SVGProps<SVGSVGElement>>
    }
  >[]
  popover?: React.ComponentProps<typeof Popover>
  containerProps?: Omit<React.ComponentProps<typeof MenuTrigger>, "children">
}

const Menu = ({
  triggerButton,
  items,
  popover, //: { isOpen, onOpenChange, ...popover } = {},
  containerProps,
  ...menuProps
}: Props) => {
  return (
    <MenuTrigger {...containerProps}>
      <Button variant={"plain"} aria-label="Menu" {...triggerButton} />
      <Popover {...popover}>
        {items ? (
          <AriaMenu {...menuProps}>
            {items.map(({ className, Icon, children, ...item }) => (
              <MenuItem
                key={item.id}
                {...item}
                className={cn(
                  "flex h-8 cursor-pointer items-center gap-x-2 px-2 leading-8 outline-none focus:bg-slate-50",
                  className,
                )}
              >
                {Icon ? <Icon className="w-3" /> : null}
                {children}
              </MenuItem>
            ))}
          </AriaMenu>
        ) : (
          popover?.children ?? null
        )}
      </Popover>
    </MenuTrigger>
  )
}

export default Menu
