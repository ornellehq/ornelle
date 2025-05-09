import type { PropsWithChildren } from "react"
import { createPortal } from "react-dom"

const HeaderLeftSlot = ({ children }: PropsWithChildren<object>) => {
  const leftSlot = document.getElementById("panel-left-render-slot")
  return leftSlot ? createPortal(children, leftSlot) : null
}

export default HeaderLeftSlot
