import type { ToOptions } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import Layers from "webui-library/src/icons/Layers"
import MailSend from "webui-library/src/icons/MailSend"
import Passport from "webui-library/src/icons/Passport"
import SearchINSquare from "webui-library/src/icons/SearchInSquare"
import Users from "webui-library/src/icons/Users"
import ExternalDrive from "webui-library/src/icons/external-drive"
import AddSquareBold from "webui-library/src/icons/solar/add-square-bold"
import type { Icon } from "webui-library/src/types"
import Menu from "webui-library/src/widgets/menu"

interface AddMenuItem {
  id: string
  name: string
  Icon: Icon
  route?: ToOptions
  onOpen?: () => void
}

export const AddMenu = () => {
  const navigate = useNavigate()

  // Items for the add menu, same as in create-entity-picker.tsx
  const items: AddMenuItem[] = [
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
    {
      id: "cr8et",
      name: "Email Template",
      Icon: MailSend,
    },
  ]

  // Convert items to menu items format
  const menuItems = items.map((item) => ({
    id: item.id,
    children: (
      <div className="flex items-center gap-x-2">
        <span className="text-gray-600">
          <item.Icon width={16} height={16} />
        </span>
        <span>{item.name}</span>
      </div>
    ),
  }))

  return (
    <Menu
      triggerButton={{
        className:
          "w-full flex items-center gap-x-1.5 -ml-1 pl-1 h-7 text-[#374151]",
        children: (
          <>
            <AddSquareBold width={16} height={16} className="text-purpleX11" />
            <span className="">Create</span>
          </>
        ),
      }}
      onAction={(key) => {
        const id = key as string
        const selectedItem = items.find((item) => item.id === id)

        if (selectedItem?.route) {
          navigate(selectedItem.route)
        } else if (selectedItem?.onOpen) {
          selectedItem.onOpen()
        } else {
          navigate({
            to: ".",
            search: {
              drw: {
                id,
              },
            },
          })
        }
      }}
      items={menuItems}
    />
  )
}

export default AddMenu
