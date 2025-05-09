import type { ToOptions } from "@tanstack/react-router"
import { motion } from "framer-motion"
import qs from "qs"
import { useState } from "react"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import DialogTrigger from "webui-library/src/dialog-trigger"
import Add from "webui-library/src/icons/Add"
import CaretDown from "webui-library/src/icons/CaretDown"
import Layers from "webui-library/src/icons/Layers"
import Passport from "webui-library/src/icons/Passport"
import SearchINSquare from "webui-library/src/icons/SearchInSquare"
import Users from "webui-library/src/icons/Users"
import ExternalDrive from "webui-library/src/icons/external-drive"
import ListBox from "webui-library/src/list-box"
import ListBoxItem from "webui-library/src/list-box-item"

import Popover from "webui-library/src/popover"
import type { Icon } from "webui-library/src/types"

const CreateEntityPicker = () => {
  const [opened, setOpened] = useState(false)
  const items: { id: string; name: string; Icon: Icon; route?: ToOptions }[] = [
    {
      id: "cr8role",
      name: "Role",
      Icon: Passport,
    },
    {
      id: "cr8op",
      name: "Opening",
      Icon: SearchINSquare,
    },
    {
      id: "cr8app",
      name: "Application",
      Icon: Layers,
    },
    {
      id: "cr8cdt",
      name: "Candidate",
      Icon: Users,
    },
    {
      id: "cr8f",
      name: "Form",
      Icon: ExternalDrive,
    },
  ]

  return (
    <DialogTrigger isOpen={opened} onOpenChange={setOpened}>
      <Button variant={"plain"} className="flex items-center rounded">
        <Add />
        <CaretDown width={10} height={10} />
      </Button>
      <Popover placement="bottom right">
        <Dialog>
          <motion.div
            layoutId="create-entity-menu"
            layout
            className="max-h-96 w-56 overflow-y-auto p-1"
          >
            <ListBox
              aria-label="List of entity types that can be created"
              shouldFocusWrap
              autoFocus
              className="block outline-none"
            >
              {items.map(({ id, name, Icon, route }) => {
                return (
                  <ListBoxItem
                    // @ts-expect-error
                    href={
                      route?.to ??
                      `?${qs.stringify({ drw: { id } }, { encode: false })}`
                    }
                    key={id}
                    className="flex h-8 items-center gap-x-2 rounded-md px-2 leading-8 outline-none hover:bg-slate-50 focus:bg-slate-50"
                    onAction={() => setOpened(false)}
                    textValue={name}
                  >
                    <span className="text-slate-600">
                      <Icon width={16} height={16} />
                    </span>
                    <span>{name}</span>
                  </ListBoxItem>
                )
              })}
            </ListBox>
          </motion.div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

export default CreateEntityPicker
