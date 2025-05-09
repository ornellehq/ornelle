import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { PopoverProps } from "react-aria-components"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import DialogTrigger from "webui-library/src/dialog-trigger"
import Add from "webui-library/src/icons/Add"
import Check from "webui-library/src/icons/check"
import ListBox from "webui-library/src/list-box"
import ListBoxItem from "webui-library/src/list-box-item"
import Popover from "webui-library/src/popover"
import { useWorkspaceApi } from "~/core/workspace/api"

interface Props {
  onChange(id: string, selected: boolean): Promise<boolean>
  selection: string[]
  placement?: PopoverProps["placement"]
}

const OpeningsSelector = ({
  onChange,
  selection,
  placement = "bottom right",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const api = useWorkspaceApi()
  const { data: openings } = useQuery({
    queryKey: [api.opening.getOpenings.name],
    queryFn: () => {
      return api.opening.getOpenings()
    },
  })
  const selectedOpenings = selection
    .map((id) => openings?.find((opening) => opening.id === id))
    .filter(Boolean)

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="plain"
        className="inline-flex h-6 items-center justify-center p-1 px-1 text-[13px] text-gray-500 leading-6"
        onPress={() => setIsOpen(true)}
      >
        {selectedOpenings.length > 0 ? (
          selectedOpenings.length === 1 ? (
            <span>{selectedOpenings[0]?.title}</span>
          ) : (
            <span>{selectedOpenings.length} openings</span>
          )
        ) : (
          <>
            <span className="mr-0.5">Openings</span>
            <Add className="mt-1 w-3" />
          </>
        )}
        {/* <SearchINSquare className="h-5 w-5" /> */}
      </Button>
      <Popover placement={placement}>
        <Dialog>
          <div className="max-h-96 w-56 overflow-y-auto p-1">
            <ListBox className="block outline-none">
              {openings?.map((opening) => {
                const { id, title } = opening
                const selected = selection.includes(id)
                return (
                  <ListBoxItem
                    key={id}
                    className="flex h-8 items-center rounded-md px-2 leading-8 outline-none hover:bg-slate-50 focus:bg-slate-50"
                    onAction={async () => {
                      // Only close the popover if the action succeeded
                      const success = await onChange(id, !selected)
                      if (success) {
                        setIsOpen(false)
                      }
                    }}
                  >
                    <span
                      title={title}
                      className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {title}
                    </span>
                    {selected ? <Check /> : null}
                  </ListBoxItem>
                )
              })}
            </ListBox>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

export default OpeningsSelector
