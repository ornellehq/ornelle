import { atom } from "jotai"
import type { DrawerConfig } from "./util"

export const drawerAtom = atom<DrawerConfig | null>(null)
