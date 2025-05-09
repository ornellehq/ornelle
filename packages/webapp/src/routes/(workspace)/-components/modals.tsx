import type { FunctionComponent } from "react"
import CreateEmailTemplate from "./modals/create-email-template.js"
import type { ModalParams } from "./modals/util.js"
import LeaveANote from "./panels/application/leave-a-note.js"

interface ModalConfig {
  title: string
  Component: FunctionComponent<object>
}

const modalComponentNdIdMismatch =
  "Attempt to render wrong component for drawer ID"
const modals: Record<
  ModalParams["id"],
  ModalConfig | ((args: { modal: ModalParams }) => ModalConfig)
> = {
  cr8et: {
    title: "Saved email",
    Component: CreateEmailTemplate,
  },
  cr8nt: ({ modal }) => {
    if (modal.id !== "cr8nt") throw new Error(modalComponentNdIdMismatch)

    return {
      title: "Note",
      Component: () => <LeaveANote entityId={modal.id} />,
    }
  },
}

export default modals
