import type { ToOptions } from "@tanstack/react-router"
import type { ReactElement } from "react"
import type { DrawerConfig } from "~/core/workspace/drawer/util"

export interface TMenu {
  id: string
  title: string
  link?: ToOptions
  icon?: ReactElement
  menu?: TMenu[]
  isView?: boolean
  isSavedItem?: boolean
  isSavedFolder?: boolean
  drw?: DrawerConfig
  entityType?: string
  parentId?: string
  createdAt?: number
}

export interface TMenuGroup {
  id: string
  title?: string
  collapsible?: boolean
  link?: ToOptions
  menu?: TMenu[]
  icon?: ReactElement
  rightSide?: ReactElement
  isSavedFolder?: boolean
}
