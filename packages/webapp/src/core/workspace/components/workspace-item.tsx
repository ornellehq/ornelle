import { Link } from "@tanstack/react-router"
import React, {
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react"
import ThreeDotsHorizontal from "webui-library/src/icons/ThreeDotsHorizontal"
import { TextFieldInput } from "webui-library/src/text-field-input"
import Menu from "webui-library/src/widgets/menu"

interface MenuItem {
  id: string
  Icon: React.ComponentType<{ className?: string }>
  children: ReactNode
  onAction: () => void
}

export interface WorkspaceItemProps {
  id: string
  name: string
  linkTo?: ComponentProps<typeof Link>["to"]
  linkParams?: ComponentProps<typeof Link>["params"]
  linkSearch?: ComponentProps<typeof Link>["search"]
  isRenaming?: boolean
  topRowItems?: Array<{
    content: ReactNode
    id: string
  }>
  bottomRowItems?: ReactNode
  menuItems?: MenuItem[]
  onRenameStart?: (id: string) => void
  onRenameSubmit?: React.FocusEventHandler<HTMLInputElement>
  onRenameKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
}

export function WorkspaceItem({
  id,
  name,
  linkTo,
  linkParams,
  linkSearch,
  isRenaming = false,
  topRowItems = [],
  bottomRowItems,
  menuItems = [],
  onRenameStart,
  onRenameSubmit,
  onRenameKeyDown,
}: WorkspaceItemProps) {
  const renameInputRef = useRef<HTMLInputElement>(null)

  // Focus input when renaming starts
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus()
    }
  }, [isRenaming])

  return (
    <li className="group relative border-gray-100 border-b border-solid bg-white px-6 py-3 text-[13px] text-gray-400 hover:shadow-sm">
      {!isRenaming && typeof linkTo === "string" ? (
        <Link
          className="absolute inset-0"
          to={linkTo}
          params={linkParams || {}}
          search={linkSearch || {}}
        />
      ) : null}
      <div className="flex items-center gap-x-2">
        {isRenaming ? (
          <div className="-ml-0.5 z-10">
            <TextFieldInput
              variant="plain"
              ref={renameInputRef}
              type="text"
              defaultValue={name}
              onKeyDown={onRenameKeyDown}
              onBlur={onRenameSubmit}
              className="rounde h-auto border border-gray-200 px-0.5 py-0.5 text-[#374151] text-sm shadow-inner outline-none ring-1 ring-gray-300 [field-sizing:content] focus:border-gray-400 focus:ring-gray-400"
              autoFocus
            />
          </div>
        ) : (
          <div className="text-[#374151] text-sm">{name}</div>
        )}
        <div className="relative opacity-0 hover:opacity-100 group-hover:opacity-100">
          {menuItems.length > 0 && (
            <Menu
              triggerButton={{
                children: (
                  <ThreeDotsHorizontal className="h-4 w-4 text-slate-600" />
                ),
                className: "p-1",
              }}
              items={menuItems.map(
                ({ id: itemId, Icon, children, onAction }) => ({
                  id: itemId,
                  Icon,
                  children,
                  onAction,
                }),
              )}
            />
          )}
        </div>
        <div className="ml-auto flex items-center gap-x-2">
          <div className="relative z-10 opacity-0 hover:opacity-100 group-hover:opacity-100" />
        </div>
      </div>

      {topRowItems.length > 0 ? (
        <div className="mt-2 flex items-center gap-x-2">
          {topRowItems.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 ? <span className="mx-1 text-[10px]">•</span> : null}
              <span key={item.id} className="">
                {item.content}
              </span>
            </React.Fragment>
          ))}
        </div>
      ) : null}

      {bottomRowItems ? (
        <div className="relative mt-3 border-gray-100 border-t pt-3">
          <div className="flex items-center">
            <div className="relative z-10 flex items-center gap-x-4 divide-x">
              {bottomRowItems}
            </div>
          </div>
        </div>
      ) : null}
    </li>
  )
}
