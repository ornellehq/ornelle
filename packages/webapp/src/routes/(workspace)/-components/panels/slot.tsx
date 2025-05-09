import type { PropsWithChildren } from "react"
import { createPortal } from "react-dom"

export const PanelHeaderTitleSlot = ({
  children,
}: PropsWithChildren<object>) => {
  const titleSlot = document.getElementById("panel-title-slot")
  return titleSlot ? createPortal(children, titleSlot) : null
}

export const PanelHeaderLeftSlot = ({
  children,
}: PropsWithChildren<object>) => {
  const leftSlot = document.getElementById("panel-left-render-slot")
  return leftSlot ? createPortal(children, leftSlot) : null
}

export const PanelHeaderRightSlot = ({
  children,
}: PropsWithChildren<object>) => {
  const rightSlot = document.getElementById("panel-right-render-slot")
  return rightSlot ? createPortal(children, rightSlot) : null
}
