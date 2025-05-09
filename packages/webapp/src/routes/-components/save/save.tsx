import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import { Button } from "webui-library/src/button"
import Bookmark02 from "webui-library/src/icons/huge-icons/bookmark-02"
import BookmarkBold from "webui-library/src/icons/solar/bookmark-bold"
import BookmarkOutline from "webui-library/src/icons/solar/bookmark-outline"
import { cn } from "webui-library/src/utils/cn"
import Menu from "webui-library/src/widgets/menu"
import { useWorkspaceApi } from "~/core/workspace/api"

interface SaveProps {
  entityId: string
  entityType: string
  name?: string
  className?: string
  triggerButton?: React.ComponentProps<typeof Button> & {
    render?: (props: { saved?: boolean }) => React.ReactNode
  }
}

export const Save = ({
  entityId,
  entityType,
  name,
  className,
  triggerButton,
}: SaveProps) => {
  const api = useWorkspaceApi()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  // Fetch all saved items
  const { data: savedItems = [] } = useQuery({
    queryKey: ["savedItems"],
    queryFn: async () => api.saved.getSavedItems(),
  })

  // Fetch all folders
  const { data: folders = [] } = useQuery({
    queryKey: ["savedFolders"],
    queryFn: async () => api.savedFolder.getSavedFolders({}),
  })

  // Check if this entity is already saved
  const savedItem = useMemo(() => {
    return savedItems.find(
      (item) => item.entityId === entityId && item.entityType === entityType,
    )
  }, [savedItems, entityId, entityType])

  const isSaved = Boolean(savedItem)

  // Handle save action
  const handleSave = useCallback(
    async (folderId?: string) => {
      try {
        if (!savedItem) {
          await api.saved.createSavedItem({
            createSavedItemRequest: {
              entityId,
              entityType,
              name: name || `Saved ${entityType}`,
              ...(folderId && { folderId }),
            },
          })
        } else {
          // If it's already saved and user clicked the same folder, unsave it
          // Otherwise update the folder
          if (savedItem?.folderId === folderId) {
            await api.saved.deleteSavedItem({ id: savedItem.id })
          } else if (folderId) {
            await api.saved.updateSavedItem({
              id: savedItem?.id || "",
              updateSavedItemRequest: {
                folderId,
              },
            })
          }
        }

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["savedItems"] })
        setIsOpen(false)
      } catch (error) {
        console.error("Error saving item:", error)
      }
    },
    [api, entityId, entityType, name, queryClient, savedItem],
  )

  // Handle remove action
  const handleRemove = useCallback(async () => {
    if (savedItem) {
      try {
        await api.saved.deleteSavedItem({ id: savedItem.id })
        queryClient.invalidateQueries({ queryKey: ["savedItems"] })
        setIsOpen(false)
      } catch (error) {
        console.error("Error removing saved item:", error)
      }
    }
  }, [api, queryClient, savedItem])

  return (
    <Menu
      triggerButton={{
        children: (
          <>
            {isSaved ? (
              <BookmarkBold width={14} className="text-black" />
            ) : (
              <BookmarkOutline width={14} className="" />
            )}
          </>
        ),
        ...triggerButton,
        className: cn(
          "w-auto flex items-center justify-center rounded-full hover:bg-gray-100",
          className,
          triggerButton?.className,
        ),
        onPress: () => setIsOpen(true),
      }}
      popover={{
        isOpen,
        onOpenChange: setIsOpen,
        children: (
          <div className="w-64 p-2">
            <div className="">
              <h3 className="mb-1 font-medium text-neutral-400 text-sm">
                {isSaved ? "Saved to" : "Save to"}
              </h3>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <Button
                    key={folder.id}
                    variant="plain"
                    className={cn(
                      "flex w-full items-center rounded py-1 text-left text-sm",
                      savedItem?.folderId === folder.id
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50",
                    )}
                    onPress={() => handleSave(folder.id)}
                  >
                    <Bookmark02
                      width={14}
                      className={cn(
                        "mr-2",
                        savedItem?.folderId === folder.id
                          ? "fill-blue-500 text-blue-500"
                          : "text-gray-400",
                      )}
                    />
                    {folder.name}
                  </Button>
                ))}
                <Button
                  variant="plain"
                  className={cn(
                    "flex w-full items-center rounded py-1 text-left text-sm",
                    !savedItem?.folderId && isSaved
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50",
                  )}
                  onPress={() => handleSave(undefined)}
                >
                  <Bookmark02
                    width={14}
                    className={cn(
                      "mr-2",
                      !savedItem?.folderId && isSaved
                        ? "fill-blue-500 text-blue-500"
                        : "text-gray-400",
                    )}
                  />
                  Favorites
                </Button>
              </div>
            </div>

            {isSaved ? (
              <div className="border-t pt-2">
                <Button
                  variant="plain"
                  className="w-full rounded px-2 py-1 text-left text-red-500 text-sm hover:bg-red-50"
                  onPress={handleRemove}
                >
                  Remove
                </Button>
              </div>
            ) : null}
          </div>
        ),
      }}
    />
  )
}

export default Save
