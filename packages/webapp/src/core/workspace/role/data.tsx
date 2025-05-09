import type { DataGridColumn } from "~/routes/(workspace)/-components/data-grid/types"
import type { Role } from "~/types/entities"

export const avatarColors = [
  ["#355070", "#6D597A", "#B56576", "#E56B6F", "#EAAC8B"],
  ["#F72585", "#7209B7", "#3A0CA3", "#4361EE", "#4CC9F0"],
  ["#CCD5AE", "#E9EDC9", "#FEFAE0", "#FAEDCD", "#D4A373"],
  ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"],
  ["#000814", "#001D3D", "#003566", "#FFC300", "#FFD60A"],
  ["#9B5DE5", "#F15BB5", "#FEE440", "#00BBF9", "#00F5D4"],
  [
    "#F8F9FA",
    "#E9ECEF",
    "#DEE2E6",
    "#CED4DA",
    "#ADB5BD",
    "#6C757D",
    "#495057",
    "#343A40",
    "#212529",
  ],
  ["#353535", "#3C6E71", "#FFFFFF", "#D9D9D9", "#284B63"],
  [
    "#F72585",
    "#B5179E",
    "#7209B7",
    "#560BAD",
    "#480CA8",
    "#3A0CA3",
    "#3F37C9",
    "#4361EE",
    "#4895EF",
    "#4CC9F0",
  ],
  ["#03045E", "#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8"],
]

export const rolesBuiltInColumns: DataGridColumn<Role>[] = [
  {
    key: "title",
    name: "Role",
    sortName: "Title",
    // transform: (data) => {
    //   const title = data as string
    //   return (
    //     <div className="flex items-center gap-x-1.5">
    //       {/* <Avatar name={title} size={12} colors={avatarColors[9]} /> */}

    //       <span>{title}</span>
    //     </div>
    //   )
    // },
    type: "system",
    initialWidth: "w-72",
    field: {
      type: "Text",
      options: {},
    },
    primary: true,
  },
  {
    key: "description",
    name: "Description",
    type: "system",
    initialWidth: "w-48",
    transform: (data: Role["description"]) => {
      const div = document.createElement("div")
      div.innerHTML = data?.html ?? ""
      return div.textContent ?? ""
    },
    field: {
      type: "Text",
      options: {
        format: "rte",
      },
    },
  },
]
