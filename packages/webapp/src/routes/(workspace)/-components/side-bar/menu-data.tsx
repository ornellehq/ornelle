import { useQuery } from "@tanstack/react-query"
import { useId } from "react"
import { GetViews200ResponseInnerEntityTypeEnum } from "sdks/src/server-sdk"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useWorkspace } from "~/core/workspace/workspace.context"
import {
  applicationIcon,
  candidateIcon,
  formIcon,
  openingIcon,
  roleIcon,
} from "./icons"
import type { TMenu, TMenuGroup } from "./types"

export const useProfileMenuGroup = (): TMenuGroup[] => {
  const { code } = useWorkspace()

  const menuGroups: TMenuGroup[] = [
    {
      id: useId(),
      title: "Forms",
      link: {
        to: "/w/$code/forms",
        params: {
          code,
        },
      },
      icon: formIcon,
    },
    {
      id: useId(),
      title: "Email templates",
      link: {
        to: "/w/$code/email-templates",
        params: {
          code,
        },
      },
      icon: formIcon,
    },
  ].map(
    (menu) =>
      ({
        ...menu,
        icon: <span className="text-[#967696]">{menu.icon}</span>,
      }) as TMenuGroup,
  )

  return menuGroups
}

export const useWorkspaceMenuGroup = (): TMenuGroup[] => {
  const { code } = useWorkspace()

  const menuGroups: TMenuGroup[] = [
    {
      id: useId(),
      title: "Workspace",
      menu: [
        {
          id: useId(),
          title: "Roles",
          link: {
            to: "/w/$code/roles",
            params: {
              code,
            },
          },
          icon: roleIcon,
          drw: { id: "cr8role" },
        },
        {
          id: useId(),
          title: "Openings",
          link: {
            to: "/w/$code/openings",
            params: {
              code,
            },
          },
          icon: openingIcon,
          drw: { id: "cr8op" },
        },
        {
          id: useId(),
          title: "Applications",
          link: {
            to: "/w/$code/applications",
            params: {
              code,
            },
          },
          icon: applicationIcon,
          drw: { id: "cr8app" },
        },
        {
          id: useId(),
          title: "Candidates",
          link: {
            to: "/w/$code/candidates",
            params: {
              code,
            },
          },
          icon: candidateIcon,
          drw: { id: "cr8cdt" },
        },
      ].map(
        (menu) =>
          ({
            ...menu,
            icon: <span className="text-[#967696]">{menu.icon}</span>,
          }) as TMenu,
      ),
    },
  ]

  return menuGroups
}

export const useSavedMenuGroup = (): TMenuGroup[] => {
  const { code } = useWorkspace()
  const api = useWorkspaceApi()

  // Fetch view data
  const { data: views = [] } = useQuery({
    queryKey: [api.view.getViews.name],
    queryFn: async () => api.view.getViews(),
  })

  // Fetch saved folders
  const { data: savedFolders = [] } = useQuery({
    queryKey: ["savedFolders"],
    queryFn: async () =>
      api.savedFolder.getSavedFolders({ parentId: undefined }),
  })

  // Fetch saved items
  const { data: savedItems = [] } = useQuery({
    queryKey: ["savedItems"],
    queryFn: async () => api.saved.getSavedItems(),
  })

  // Convert views to menu items
  const viewsAsMenus: TMenu[] = views.map(
    ({ id, name, entityType, createdAt, parentId }) => ({
      id,
      title: name,
      link: {
        to: `/w/${code}/${
          entityType === GetViews200ResponseInnerEntityTypeEnum.Candidate
            ? "candidates"
            : entityType === GetViews200ResponseInnerEntityTypeEnum.Application
              ? "applications"
              : entityType === GetViews200ResponseInnerEntityTypeEnum.Opening
                ? "openings"
                : "roles"
        }/${id}`,
        params: {
          code,
        },
      },
      isView: true,
      entityType,
      parentId,
      icon: (
        <span className="text-gray-400">
          {entityType === GetViews200ResponseInnerEntityTypeEnum.Candidate
            ? candidateIcon
            : entityType === GetViews200ResponseInnerEntityTypeEnum.Application
              ? applicationIcon
              : entityType === GetViews200ResponseInnerEntityTypeEnum.Opening
                ? openingIcon
                : roleIcon}
        </span>
      ),
      createdAt: new Date(createdAt || Date.now()).getTime(),
    }),
  )

  // Create a map of folder ID to saved items
  const itemsByFolderId: Record<string, TMenu[]> = {}

  // Create a map of folder ID to child folders
  const foldersByParentId: Record<string, TMenuGroup[]> = {}

  // Top level items
  const topLevelItems: TMenu[] = []

  // Items without a folder go to favorites
  const favoritesItems: TMenu[] = []

  // Map all saved items to their respective folders
  for (const item of savedItems) {
    const menuItem: TMenu = {
      id: item.id,
      title: item.name || "Unnamed Item",
      link: {
        to: "",
        search:
          item.entityType === "Application"
            ? { drw: { id: "ap", e: item.entityId } }
            : item.entityType === "Opening"
              ? { drw: { id: "op", e: item.entityId } }
              : item.entityType === "Candidate"
                ? { drw: { id: "cd", e: item.entityId } }
                : item.entityType === "Role"
                  ? { drw: { id: "role", e: item.entityId } }
                  : {},
      },
      isSavedItem: true,
      entityType: item.entityType,
      icon: (
        <span className="text-gray-400">
          {(item.entityType || "").toLowerCase().includes("candidate")
            ? candidateIcon
            : (item.entityType || "").toLowerCase().includes("application")
              ? applicationIcon
              : (item.entityType || "").toLowerCase().includes("opening")
                ? openingIcon
                : roleIcon}
        </span>
      ),
      createdAt: new Date(item.createdAt || Date.now()).getTime(),
    }

    if (!item.folderId) {
      favoritesItems.push(menuItem)
    } else {
      if (!itemsByFolderId[item.folderId]) {
        itemsByFolderId[item.folderId] = []
      }
      itemsByFolderId[item.folderId]?.push(menuItem)
    }
  }

  // Process all folders and organize by parent/child relationship
  for (const folder of savedFolders) {
    if (folder.parentId) {
      if (!foldersByParentId[folder.parentId]) {
        foldersByParentId[folder.parentId] = []
      }
      foldersByParentId[folder.parentId]?.push({
        ...folder,
        isSavedFolder: true,
        createdAt: new Date(folder.createdAt || Date.now()).getTime(),
      })
    }
  }

  // Process views based on parentId
  for (const view of viewsAsMenus) {
    if (view.parentId) {
      if (!itemsByFolderId[view.parentId]) {
        itemsByFolderId[view.parentId] = []
      }
      itemsByFolderId[view.parentId]?.push(view)
    } else {
      // Views without parentId go to top level
      topLevelItems.push(view)
    }
  }

  // Create folder icon component
  const folderIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-400"
    >
      <title>Folder</title>
      <path
        d="M1.16602 4.05416C1.16602 3.53907 1.16602 3.28182 1.20685 3.06716C1.2939 2.60623 1.51785 2.18224 1.84948 1.8505C2.18111 1.51876 2.60503 1.29468 3.06593 1.20749C3.28118 1.16666 3.53902 1.16666 4.05352 1.16666C4.27868 1.16666 4.39185 1.16666 4.50035 1.17657C4.96763 1.22046 5.41081 1.40424 5.77202 1.70391C5.85602 1.77332 5.93535 1.85266 6.09518 2.01249L6.41602 2.33332C6.89202 2.80932 7.13002 3.04732 7.41468 3.20541C7.57114 3.29261 7.73713 3.36151 7.90935 3.41074C8.22318 3.49999 8.55977 3.49999 9.23235 3.49999H9.45052C10.9858 3.49999 11.7541 3.49999 12.2528 3.94916C12.2991 3.98999 12.3427 4.03355 12.3835 4.07982C12.8327 4.57857 12.8327 5.34682 12.8327 6.88216V8.16666C12.8327 10.3664 12.8327 11.4666 12.149 12.1497C11.4653 12.8327 10.3658 12.8333 8.16602 12.8333H5.83268C3.63293 12.8333 2.53277 12.8333 1.84968 12.1497C1.1666 11.466 1.16602 10.3664 1.16602 8.16666V4.05416Z"
        fill="currentColor"
      />
      <path
        d="M10.4993 6.33092V3.5H8.16602V6.33092C8.16602 6.50008 8.16602 6.58467 8.22143 6.61908C8.27685 6.6535 8.3521 6.615 8.50377 6.53975L9.22827 6.17692C9.2796 6.15183 9.30527 6.139 9.33268 6.139C9.3601 6.139 9.38577 6.15183 9.4371 6.17692L10.1616 6.53975C10.3133 6.61558 10.3891 6.65292 10.4439 6.61908C10.4993 6.58408 10.4993 6.50008 10.4993 6.33092Z"
        fill="#E7E2E7"
      />
    </svg>
  )

  // Recursive function to build folder menu structure
  const buildFolderMenu = (folder: TMenuGroup): TMenu => {
    const folderId = folder.id
    const childFolders = foldersByParentId[folderId] || []
    const folderItems = itemsByFolderId[folderId] || []

    // Create submenus for the folder
    const subMenus: TMenu[] = []

    // Add child folders
    for (const childFolder of childFolders) {
      subMenus.push(buildFolderMenu(childFolder))
    }

    // Add items in this folder
    for (const item of folderItems) {
      subMenus.push(item)
    }

    // Sort everything by createdAt
    subMenus.sort((a, b) => {
      const aCreatedAt = a.createdAt || 0
      const bCreatedAt = b.createdAt || 0
      return aCreatedAt - bCreatedAt
    })

    return {
      id: folder.id,
      title: folder.name || "Unnamed Folder",
      // link: `/w/${code}/saved/${folder.id}`,
      icon: folderIcon,
      isSavedFolder: true,
      menu: subMenus.length > 0 ? subMenus : undefined,
      createdAt: new Date(folder.createdAt || Date.now()).getTime(),
    }
  }

  // Get root folders (no parentId)
  const rootFolders = savedFolders.filter((folder) => !folder.parentId)

  // Build menu structure for root folders
  const rootFolderMenus: TMenu[] = rootFolders.map((folder) =>
    buildFolderMenu({
      ...folder,
      isSavedFolder: true,
      createdAt: new Date(folder.createdAt || Date.now()).getTime(),
    }),
  )

  // Sort all items by createdAt
  // Sort favorites by createdAt
  favoritesItems.sort((a, b) => {
    const aTime = a.createdAt || 0
    const bTime = b.createdAt || 0
    return bTime - aTime
  })

  // Sort top level views by createdAt
  topLevelItems.sort((a, b) => {
    const aTime = a.createdAt || 0
    const bTime = b.createdAt || 0
    return bTime - aTime
  })

  // Sort root folders by createdAt
  rootFolderMenus.sort((a, b) => {
    const aTime = a.createdAt || 0
    const bTime = b.createdAt || 0
    return bTime - aTime
  })

  // All root level items combined and sorted
  const allRootItems = [...rootFolderMenus, ...topLevelItems]
  allRootItems.sort((a, b) => {
    const aTime = a.createdAt || 0
    const bTime = b.createdAt || 0
    return bTime - aTime
  })

  // Main "Saved" menu group
  const savedMenuGroup: TMenuGroup[] = [
    {
      id: useId(),
      title: "",
      menu: [
        {
          id: "favorites",
          title: "Favorites",
          menu: favoritesItems,
          icon: (
            <svg
              width="16"
              height="16"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Favorite</title>
              <path
                d="M12.8327 8.16666V6.88216C12.8327 5.34682 12.8327 4.57857 12.3835 4.07982C12.3423 4.0338 12.2987 3.98999 12.2528 3.94857C11.7541 3.49999 10.9858 3.49999 9.45052 3.49999H9.23235C8.55977 3.49999 8.22318 3.49999 7.90935 3.41074C7.73713 3.36151 7.57114 3.29261 7.41468 3.20541C7.13002 3.04732 6.89202 2.80874 6.41602 2.33332L6.09518 2.01249C5.93535 1.85266 5.85602 1.77332 5.77202 1.70332C5.41074 1.40386 4.96756 1.22029 4.50035 1.17657C4.39185 1.16666 4.27868 1.16666 4.05352 1.16666C3.53843 1.16666 3.28118 1.16666 3.06652 1.20749C2.60559 1.29454 2.1816 1.51849 1.84986 1.85012C1.51812 2.18175 1.29404 2.60567 1.20685 3.06657C1.16602 3.28182 1.16602 3.53966 1.16602 4.05416V8.16666C1.16602 10.3664 1.16602 11.4666 1.84968 12.1497C2.53335 12.8327 3.63293 12.8333 5.83268 12.8333H8.16602C10.3658 12.8333 11.4659 12.8333 12.149 12.1497C12.8321 11.466 12.8327 10.3664 12.8327 8.16666Z"
                fill="#F98D8D"
              />
              <path
                d="M7.5555 6.53276L7.49833 6.43009C7.27666 6.03168 7.16583 5.83334 7.00016 5.83334C6.8345 5.83334 6.72366 6.03168 6.502 6.43009L6.44483 6.53276C6.38183 6.64593 6.35033 6.70193 6.30133 6.73926C6.25175 6.77659 6.1905 6.79059 6.068 6.81801L5.95716 6.84368C5.52666 6.94109 5.31141 6.98951 5.26008 7.15401C5.20875 7.31851 5.35575 7.49059 5.64916 7.83359L5.725 7.92226C5.80841 8.01968 5.85041 8.06809 5.86908 8.12876C5.88775 8.18943 5.88133 8.25418 5.86908 8.38426L5.85741 8.50268C5.81308 8.96059 5.79091 9.18984 5.9245 9.29134C6.05866 9.39284 6.2605 9.30009 6.66358 9.11459L6.76741 9.06676C6.88233 9.01426 6.9395 8.98801 7.00016 8.98801C7.06083 8.98801 7.118 9.01426 7.23291 9.06676L7.33675 9.11459C7.73983 9.30068 7.94166 9.39284 8.07583 9.29134C8.21 9.18984 8.18725 8.96059 8.14291 8.50268L8.13125 8.38426C8.119 8.25418 8.11258 8.18943 8.13125 8.12876C8.14991 8.06809 8.19191 8.01968 8.27533 7.92226L8.35116 7.83359C8.64458 7.49059 8.79158 7.31909 8.74025 7.15401C8.68891 6.98951 8.47366 6.94109 8.04316 6.84368L7.93233 6.81801C7.80983 6.79059 7.74858 6.77718 7.699 6.73926C7.65 6.70193 7.6185 6.64593 7.5555 6.53276Z"
                fill="#FAF5FA"
              />
            </svg>
          ),
        },
        ...allRootItems,
      ],
    },
  ]

  return savedMenuGroup
}
