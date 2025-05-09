import { Link } from "@tanstack/react-router"
import { cn } from "webui-library/src/utils/cn"
import { MenuList } from "./menu-item"
import { titleClassName } from "./shared"
import type { TMenuGroup } from "./types"

interface MenuGroupProps extends TMenuGroup {
  depth: number
}

export const MenuGroup = ({
  title,
  icon,
  link,
  menu,
  depth,
  rightSide,
}: MenuGroupProps) => {
  const titleChildren = (
    <>
      {icon ? icon : null}
      {title}
    </>
  )

  return (
    <div key={`${title}`} className="flex flex-col">
      {title ? (
        link ? (
          <Link
            {...link}
            className={cn(
              titleClassName,
              "-ml-1 pl-1 transition-all duration-75 hover:bg-white",
            )}
          >
            {titleChildren}
          </Link>
        ) : (
          <div className={cn(titleClassName, "text-gray-500 text-xs")}>
            {titleChildren}
            {rightSide ?? null}
          </div>
        )
      ) : null}
      {menu ? <MenuList items={menu} depth={depth} /> : null}
    </div>
  )
}
