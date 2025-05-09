import { type Types, createTabster, getGroupper, getMover } from "tabster"

export const tabster: Types.Tabster = createTabster(window)

getMover(tabster)
getGroupper(tabster)
