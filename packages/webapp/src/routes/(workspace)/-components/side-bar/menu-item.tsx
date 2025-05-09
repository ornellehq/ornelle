import { Link, useRouter } from "@tanstack/react-router"
import { type PropsWithChildren, useEffect, useState } from "react"
import { Button } from "webui-library/src/button"
import CaretRight from "webui-library/src/icons/CaretRight"
import ThreeDotsHorizontal from "webui-library/src/icons/ThreeDotsHorizontal"
import { cn } from "webui-library/src/utils/cn"
import Menu from "webui-library/src/widgets/menu"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useWorkspaceContext } from "~/core/workspace/workspace.context"

import { RenameForm } from "./rename-form"
import {
  getFolderExpansionState,
  saveFolderExpansionState,
  titleClassName,
} from "./shared"
import type { TMenu } from "./types"

interface MenuItemProps {
  menu: TMenu
  depth: number
}

interface MenuListProps {
  items: TMenu[]
  depth: number
}

export const MenuList = ({ items, depth }: MenuListProps) => {
  return (
    <>
      {items?.map((menu) => (
        <MenuItem key={menu.id} menu={menu} depth={depth} />
      ))}
    </>
  )
}

export const MenuItem = ({
  menu: { id, title, link, icon, menu, isView, isSavedItem, isSavedFolder },
  depth,
}: MenuItemProps) => {
  const api = useWorkspaceApi()
  const { setAppState } = useWorkspaceContext()
  const [actionsOpened, setActionsOpened] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const router = useRouter()

  const isFolder = isSavedFolder || id === "favorites"
  // Initialize expanded state from local storage if it's a folder
  const [expanded, setExpanded] = useState(() => {
    // Only use local storage for saved folders, otherwise default to true
    return isFolder ? getFolderExpansionState(id) : false
  })

  const marginLeft = `${depth * 20 - (icon ? 8 : 0)}px`

  // Update local storage when expanded state changes
  useEffect(() => {
    if (isFolder) {
      saveFolderExpansionState(id, expanded)
    }
  }, [expanded, id, isFolder])

  // Get the appropriate item type name for messages
  const getItemTypeName = () => {
    if (isView) return "view"
    if (isSavedFolder) return "folder"
    if (isSavedItem) return "saved item"
    return "item"
  }

  // Get the appropriate action verb (delete for views, remove for others)
  const getActionVerb = () => {
    return isView ? "Delete" : "Remove"
  }

  // Handle rename based on item type
  const handleRename = async (newName: string) => {
    if (newName.trim() === title.trim()) return

    try {
      if (isView) {
        await api.view.updateView({
          id,
          updateViewRequest: { name: newName || "Untitled view" },
        })
        queryClient.invalidateQueries({
          queryKey: [api.view.getViews.name],
        })
        queryClient.invalidateQueries({
          queryKey: [api.view.getView.name, id],
        })
      } else if (isSavedFolder) {
        await api.savedFolder.updateSavedFolder({
          id,
          updateSavedFolderRequest: { name: newName || "Untitled folder" },
        })
        queryClient.invalidateQueries({
          queryKey: ["savedFolders"],
        })
      } else if (isSavedItem) {
        await api.saved.updateSavedItem({
          id,
          updateSavedItemRequest: { name: newName || "Untitled item" },
        })
        queryClient.invalidateQueries({
          queryKey: ["savedItems"],
        })
      }
    } catch (error) {
      console.error("Failed to rename item:", error)
    }

    setRenaming(false)
  }

  // Handle delete/remove based on item type
  const handleDeleteOrRemove = async () => {
    try {
      if (isView) {
        await api.view.deleteView({ id })
        queryClient.invalidateQueries({
          queryKey: [api.view.getViews.name],
        })
        queryClient.invalidateQueries({
          queryKey: [api.view.getView.name, id],
        })
      } else if (isSavedFolder) {
        await api.savedFolder.deleteSavedFolder({ id })
        queryClient.invalidateQueries({
          queryKey: ["savedFolders"],
        })
      } else if (isSavedItem) {
        await api.saved.deleteSavedItem({ id })
        queryClient.invalidateQueries({
          queryKey: ["savedItems"],
        })
      }
    } catch (error) {
      console.error(
        `Failed to ${isView ? "delete" : "remove"} ${getItemTypeName()}:`,
        error,
      )
    }

    setAppState((state) => ({
      ...state,
      confirmationModal: null,
    }))
  }

  // Determine if menu options (rename/delete) should be shown
  const showMenuOptions = isView || isSavedItem || isSavedFolder
  const Title = ({ children }: PropsWithChildren) =>
    link ? (
      <Link {...link} className={titleClassName}>
        {children}
      </Link>
    ) : menu ? (
      <Button
        variant="plain"
        className={cn(titleClassName, "text-left")}
        onPress={() => setExpanded(!expanded)}
      >
        {children}
      </Button>
    ) : (
      <div className={cn(titleClassName, "cursor-auto")}>{children}</div>
    )

  return (
    <div
      key={id}
      style={{
        marginLeft,
      }}
    >
      {renaming ? (
        <Button
          variant="plain"
          className="fixed inset-0 z-40 bg-black bg-opacity-[0.01] hover:bg-opacity-[0.01] focus:bg-opacity-[0.01]"
          onPress={() => setRenaming(false)}
        />
      ) : null}
      <div
        className={`group flex items-center rounded-lg pl-2 transition-all duration-75 hover:bg-white ${renaming ? "bg-white shadow-inner ring-1 ring-gray-300 hover:bg-white" : ""}`}
      >
        <Title>
          {icon || menu ? (
            <span className={"w-4 text-gray-600"}>{icon}</span>
          ) : null}
          {renaming ? (
            <>
              <RenameForm
                name={title}
                onSubmit={async ({ name }) => handleRename(name)}
                dismiss={() => setRenaming(false)}
              />
            </>
          ) : (
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-gray-700">
              {title || `Untitled ${getItemTypeName()}`}
            </span>
          )}
        </Title>
        {showMenuOptions ? (
          <Menu
            triggerButton={{
              className: `${actionsOpened ? "" : "opacity-0"} h-5 w-5 flex items-center justify-center transition-opacity duration-100 text-gray-500 group-hover:opacity-100 focus:opacity-100`,
              children: <ThreeDotsHorizontal width={14} />,
              onPress: () => setActionsOpened(true),
            }}
            popover={{
              isOpen: actionsOpened,
              onOpenChange: setActionsOpened,
            }}
            items={[
              {
                id: "rename",
                children: "Rename",
                onAction: () => setRenaming(true),
              },
              {
                id: "deleteOrRemove",
                children: getActionVerb(),
                onAction: () => {
                  setActionsOpened(false)
                  setAppState((state) => ({
                    ...state,
                    confirmationModal: {
                      title: `${getActionVerb()} the ${getItemTypeName()} "${title}"`,
                      description: isView
                        ? "This action cannot be undone."
                        : "This does not delete the associated record.",
                      confirmButton: {
                        children: getActionVerb(),
                        onPress: handleDeleteOrRemove,
                      },
                    },
                  }))
                },
              },
            ]}
          />
        ) : null}
        {menu && !renaming ? (
          <Button
            variant="plain"
            className="flex h-5 w-5 items-center justify-center text-gray-500"
            onPress={() => setExpanded(!expanded)}
          >
            <CaretRight
              width={12}
              className={`transform transition duration-200 ${expanded ? "rotate-90" : ""}`}
            />
          </Button>
        ) : null}
      </div>

      {menu && expanded ? <MenuList items={menu} depth={depth + 1} /> : null}
    </div>
  )
}
