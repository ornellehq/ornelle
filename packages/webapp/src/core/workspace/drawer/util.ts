// export const drawersConfig = [
//   {
//     id: "cr8role" as DrawerIDs,
//   },
//   {
//     id: "role",
//     d: "" as string,
//   },
// ] satisfies { id: DrawerIDs; d?: unknown }[]

export type NewEmailTemplateTab = "a" | "m"
export type DrawerConfig =
  | { id: "cr8role" | "cr8app" | "cr8cdt" | "cr8f" | "jbl" | "jbo" }
  | { id: "cr8op"; r?: string | undefined }
  | { id: "role" | "op" | "fm" | "ap" | "cd" | "et"; e: string } // [number]
  | { id: "cr8et"; tb?: NewEmailTemplateTab }

// export const drawerIds = ["cr8role", "cr8app", "cr8cdt"] as const
export type DrawerIDs = DrawerConfig["id"]
