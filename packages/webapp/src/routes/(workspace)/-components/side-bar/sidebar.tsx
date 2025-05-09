import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "webui-library/src/button"
import FolderAdd from "webui-library/src/icons/huge-icons/folder-add"
import Search from "webui-library/src/icons/search"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { cn } from "webui-library/src/utils/cn"
import { useWorkspaceApi } from "~/core/workspace/api"
import { AddMenu } from "./add-menu"
import {
  useProfileMenuGroup,
  useSavedMenuGroup,
  useWorkspaceMenuGroup,
} from "./menu-data"
import { MenuGroup } from "./menu-group"
import { titleClassName } from "./shared"
import WorkspaceMenu from "./workspace-menu"

type FolderFormValues = {
  name: string
}

export const Sidebar = () => {
  const navigate = useNavigate()
  const api = useWorkspaceApi()
  const queryClient = useQueryClient()
  const [showFolderInput, setShowFolderInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Setup form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    control,
  } = useForm<FolderFormValues>({
    defaultValues: {
      name: "",
    },
  })

  // Setup mutation
  const createFolderMutation = useMutation({
    mutationFn: async (data: FolderFormValues) => {
      return api.savedFolder.createSavedFolder({
        createSavedFolderRequest: {
          name: data.name.trim(),
          isSharedWithWorkspace: false,
        },
      })
    },
    onSuccess: () => {
      // Reset form and hide input
      reset()
      setShowFolderInput(false)

      // Refresh folder list
      queryClient.invalidateQueries({ queryKey: ["savedFolders"] })
    },
    onError: (error) => {
      console.error("Error creating folder:", error)
    },
  })

  // Get menu data from custom hooks
  const profileMenuGroup = useProfileMenuGroup()
  const workspaceMenuGroup = useWorkspaceMenuGroup()
  const savedMenuGroup = useSavedMenuGroup()

  // Handle folder creation
  const onSubmit = handleSubmit((data) => {
    if (!data.name.trim()) return
    createFolderMutation.mutate(data)
  })

  // Handle key down in the input (for escape key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault()
      setShowFolderInput(false)
      reset()
    }
  }

  // Focus the input when it appears
  const showInput = () => {
    setShowFolderInput(true)
    // Use setTimeout to ensure the input is rendered before focusing
    setTimeout(() => {
      inputRef.current?.focus()
    }, 10)
  }

  return (
    <aside className="flex w-full max-w-[260px] flex-col gap-y-6 px-5 pt-3 text-[13px]">
      <div className="flex h-10 items-center">
        <WorkspaceMenu />
      </div>
      <div className="hidden pt-1.5">
        <div className="group relative w-full">
          <Button
            variant="plain"
            className="absolute top-0 left-0 flex h-8 w-8 items-center justify-center text-gray-300 group-focus-within:text-gray-500"
          >
            <Search width={16} />
          </Button>
          <input
            placeholder="Search"
            className="h-8 w-full rounded-md bg-gray-50 pr-2 pl-8 text-gray-500 ring-gray-200 transition-all duration-100 placeholder:text-gray-300 hover:ring-1 focus:bg-white focus:outline-0 focus:ring-1"
          />
        </div>
      </div>
      <div className="w-full pb-8">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col border-b border-b-[#EDEEF0] pb-4">
            <AddMenu />
            {profileMenuGroup.map((group) => (
              <MenuGroup key={group.id} {...group} depth={0} />
            ))}
          </div>
          <div className="">
            {workspaceMenuGroup.map((group) => (
              <MenuGroup key={group.id} {...group} depth={0} />
            ))}
          </div>

          <div className="flex flex-col gap-y-1">
            <div
              className={cn(
                titleClassName,
                "group justify-between text-gray-500 text-xs",
              )}
            >
              <span>Saved </span>
              <Button
                variant="plain"
                className="opacity-0 transition-opacity duration-100 focus:opacity-100 group-hover:opacity-100"
                onPress={showInput}
                isDisabled={showFolderInput}
              >
                <FolderAdd />
              </Button>
            </div>

            {showFolderInput ? (
              <div className="py-1">
                <form onSubmit={onSubmit}>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { value, onChange } }) => {
                      return (
                        <TextFieldInput
                          variant="plain"
                          value={value}
                          onChange={onChange}
                          ref={inputRef}
                          placeholder="Folder name"
                          className="h-7 px-2 leading-7 shadow-inner ring-1 ring-gray-300"
                          autoComplete="off"
                          disabled={isSubmitting}
                          onKeyDown={handleKeyDown}
                          onBlur={() => {
                            const value = inputRef.current?.value
                            if (!value || !value.trim()) {
                              setShowFolderInput(false)
                              reset()
                            }
                          }}
                        />
                      )
                    }}
                  />
                </form>
              </div>
            ) : null}

            {savedMenuGroup.map((group) => (
              <MenuGroup key={group.id} {...group} depth={0} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
