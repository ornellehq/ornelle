export const titleClassName =
  "flex-1 py-1 flex items-center overflow-hidden rounded-lg gap-x-1.5 group text-[#374151]"

// Local storage key for expanded folder states
const FOLDER_EXPANSION_STATE_KEY = "ats-folder-expansion-states"

/**
 * Gets the expansion states of folders from local storage
 */
export const getFolderExpansionStates = (): Record<string, boolean> => {
  try {
    const stored = localStorage.getItem(FOLDER_EXPANSION_STATE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error(
      "Error reading folder expansion states from localStorage:",
      error,
    )
    return {}
  }
}

/**
 * Saves the expansion state of a folder to local storage
 */
export const saveFolderExpansionState = (
  folderId: string,
  isExpanded: boolean,
): void => {
  try {
    const states = getFolderExpansionStates()
    states[folderId] = isExpanded
    localStorage.setItem(FOLDER_EXPANSION_STATE_KEY, JSON.stringify(states))
  } catch (error) {
    console.error("Error saving folder expansion state to localStorage:", error)
  }
}

/**
 * Gets the expansion state of a specific folder from local storage
 * Default is true (expanded) if not found
 */
export const getFolderExpansionState = (folderId: string): boolean => {
  const states = getFolderExpansionStates()
  return states[folderId] !== undefined ? states[folderId] : false
}
