import { motion } from "framer-motion"
import type { FormField } from "isomorphic-blocs/src/types/form"
import { useState } from "react"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import DialogTrigger from "webui-library/src/dialog-trigger"
import Add from "webui-library/src/icons/Add"
import Calendar from "webui-library/src/icons/Calendar"
import CaretDown from "webui-library/src/icons/CaretDown"
import FolderFile from "webui-library/src/icons/FolderFile"
import Link from "webui-library/src/icons/Link"
import MailAt from "webui-library/src/icons/MailAt"
import NumberSign from "webui-library/src/icons/NumberSign"
import SmartPhone from "webui-library/src/icons/SmartPhone"
import Text from "webui-library/src/icons/Text"
import Switch from "webui-library/src/icons/toggle"
import ListBox from "webui-library/src/list-box"
import ListBoxItem from "webui-library/src/list-box-item"
import Popover from "webui-library/src/popover"
import type { Icon } from "webui-library/src/types"
import { useNewFormContext } from "./utils"

const AddField = () => {
  const { addField } = useNewFormContext()
  const [opened, setOpened] = useState(false)
  const fields: { id: FormField["type"]; name: string; Icon: Icon }[] = [
    {
      id: "text",
      name: "Text",
      Icon: Text,
    },
    {
      id: "number",
      name: "Number",
      Icon: NumberSign,
    },
    {
      id: "select",
      name: "Select",
      Icon: CaretDown,
    },
    {
      id: "toggle",
      name: "Toggle",
      Icon: Switch,
    },
    {
      id: "date",
      name: "Date",
      Icon: Calendar,
    },
    {
      id: "email",
      name: "Email",
      Icon: MailAt,
    },
    {
      id: "file",
      name: "File",
      Icon: FolderFile,
    },
    {
      id: "url",
      name: "URL",
      Icon: Link,
    },
    {
      id: "phone",
      name: "Phone number",
      Icon: SmartPhone,
    },
    // {
    //   id: useId(),
    //   name: "Process",
    //   Icon: Workflow,
    //   route: {
    //     to: "/w/$code/processes/create",
    //   },
    // },
    // {
    //   id: useId(),
    //   name: "Member",
    //   Icon: UserAdd,
    // },
    // {
    //   id: "cr8f",
    //   name: "Form",
    //   Icon: ExternalDrive,
    // },
  ]

  return (
    <DialogTrigger isOpen={opened} onOpenChange={setOpened}>
      <Button className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-500">
        <Add />
      </Button>
      <Popover placement="bottom">
        <Dialog className="outline-none">
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
              {fields.map(({ id, name, Icon }) => {
                return (
                  <ListBoxItem
                    key={id}
                    className="flex h-8 items-center gap-x-2 rounded-md px-2 leading-8 outline-none hover:bg-slate-50 focus:bg-slate-50"
                    onAction={() => {
                      // const partialField = {
                      //   type: id,
                      //   id: crypto.randomUUID(),
                      //   name,
                      //   required: true,
                      // }
                      if (id === "select") {
                        addField({
                          type: id,
                          id: crypto.randomUUID(),
                          options: ["Option 1", "Option 2"],
                          maxSelection: "unlimited",
                          name,
                          required: true,
                        })
                      } else if (id === "date") {
                        addField({
                          type: id,
                          id: crypto.randomUUID(),
                          name,
                          required: true,
                          enableEndDate: false,
                          includeTime: false,
                        })
                      } else {
                        addField({
                          type: id,
                          name,
                          required: true,
                          id: crypto.randomUUID(),
                        })
                      }

                      setOpened(false)
                    }}
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

export default AddField
