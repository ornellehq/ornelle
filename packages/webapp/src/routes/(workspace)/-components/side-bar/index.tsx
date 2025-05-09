// Export all components from their individual files
export { MenuGroup } from "./menu-group"
export { MenuItem } from "./menu-item"
export { RenameForm } from "./rename-form"
export { Sidebar } from "./sidebar"
export { type TMenu, type TMenuGroup } from "./types"

// Export Sidebar as default for backward compatibility
import { Sidebar } from "./sidebar"

export default Sidebar
