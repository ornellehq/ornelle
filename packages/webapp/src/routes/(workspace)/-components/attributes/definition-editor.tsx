import type { EntityType } from "isomorphic-blocs/src/prisma"
import { type ComponentProps, type PropsWithChildren, useState } from "react"
import { ResponseError } from "sdks/src/server-sdk"
import { toast } from "sonner"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import Modal from "webui-library/src/modal"
import ModalOverlay from "webui-library/src/modal-overlay"
import { TextFieldInput } from "webui-library/src/text-field-input"
import Menu from "webui-library/src/widgets/menu"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"

interface Props extends Partial<ComponentProps<typeof Menu>> {
  name: string
  attributeId: string
  entityType: EntityType
  isEditable?: boolean
}

const DefinitionEditor = ({
  children,
  name,
  attributeId,
  entityType,
  isEditable = true,
  ...props
}: PropsWithChildren<Props>) => {
  const api = useWorkspaceApi()
  const [opened, setOpened] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editedName, setEditedName] = useState(name)
  const updateName = async (opened: boolean) => {
    const value = editedName.trim()
    if (!opened && value !== name && value) {
      await api.attribute.updateAttribute({
        id: attributeId,
        updateAttributeRequest: { name: value },
      })
      await queryClient.invalidateQueries({
        queryKey: [api.attribute.getAttributes.name, entityType],
      })
    }
  }

  return (
    <>
      <Menu
        triggerButton={{
          children,
          variant: "plain",
          className:
            "relative h-9 w-full shrink-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-none px-2 text-left text-slate-500 leading-9 outline-none focus:after:absolute focus:after:inset-0 focus:after:block focus:after:rounded-sm focus:after:border-[0.5px] focus:after:border-slate-400 focus:after:border-solid focus-visible:ring-0",
          onPress: () => {
            if (isEditable) setOpened(!opened)
          },
        }}
        popover={{
          isOpen: opened,
          onOpenChange: async (opened) => {
            setOpened(opened)
            await updateName(opened)
          },
          children: (
            <form
              onSubmit={async (ev) => {
                ev.preventDefault()
                await updateName(false)
                setOpened(false)
              }}
            >
              {isEditable ? (
                <div className="flex flex-col gap-y-1 border-gray-200 border-b p-1">
                  <TextFieldInput
                    autoFocus
                    className="h-6 leading-6"
                    value={editedName}
                    onChange={(ev) => {
                      setEditedName(ev.target.value)
                    }}
                  />
                  {/* <Button variant="plain" className="w-full p-2 py-1.5 text-left">
                Edit property
              </Button> */}
                </div>
              ) : null}
              {isEditable ? (
                <div className="flex flex-col gap-y-1 p-1">
                  <Button
                    variant="plain"
                    className="w-full p-2 py-1 text-left"
                    onPress={() => {
                      setOpened(false)
                      setConfirmDelete(true)
                    }}
                  >
                    Delete attribute
                  </Button>
                </div>
              ) : null}
            </form>
          ),
          className: "w-64",
        }}
        {...props}
      />

      <ModalOverlay
        isDismissable
        isKeyboardDismissDisabled
        isOpen={confirmDelete}
        onOpenChange={() => {
          setConfirmDelete(false)
        }}
        className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-15 backdrop-grayscale"
      >
        <Modal className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
          <Dialog className="">
            <h2 className="mb-4 font-semibold text-xl">Delete attribute</h2>
            <p className="text-gray-700">
              The attribute ({name}) will be deleted alongside its values for
              every row. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-x-3">
              <Button
                autoFocus
                variant="plain"
                className="px-4"
                onPress={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 px-4 outline-none ring-red-200 hover:bg-red-700 focus:bg-red-700 active:bg-red-800"
                onPress={async () => {
                  try {
                    await api.attribute.deleteAttribute({
                      id: attributeId,
                    })
                  } catch (_) {
                    if (_ instanceof ResponseError) {
                      toast.error((await _.response.json()).message, {
                        duration: 1000 * 10,
                      })
                    }
                    return
                  }
                  await queryClient.invalidateQueries({
                    queryKey: [api.attribute.getAttributes.name, entityType],
                  })
                  setConfirmDelete(false)
                }}
              >
                Delete
              </Button>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  )
}

export default DefinitionEditor
