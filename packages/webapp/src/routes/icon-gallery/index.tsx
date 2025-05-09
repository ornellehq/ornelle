import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Button } from "webui-library/src/button"

// Define the route with development mode check
export const Route = createFileRoute("/icon-gallery/")({
  component: IconGallery,
  // This ensures the route is only available in development mode
  beforeLoad: () => {
    if (import.meta.env.PROD) {
      throw new Error("Icon Gallery is only available in development mode")
    }
  },
})

// TypeScript interfaces
interface IconItem {
  name: string
  path: string
  Component: React.ComponentType
  category: string
}

function IconGallery(): JSX.Element {
  const [search, setSearch] = useState<string>("")
  const [icons, setIcons] = useState<IconItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    async function loadIcons() {
      setLoading(true)
      try {
        // Dynamically import all the icon files
        const iconModules = import.meta.glob<{ default: React.ComponentType }>(
          "./../../../../../packages/webui-library/src/icons/**/*.ts",
        )

        const iconPromises = Object.entries(iconModules).map(
          async ([path, importFn]) => {
            try {
              const component = await importFn()
              const filename = path.split("/").pop()
              const name = filename?.replace(".ts", "") || ""

              // Determine category based on path
              let category = "default"
              if (path.includes("/huge-icons/")) {
                category = "huge-icons"
              } else if (path.includes("/solar/")) {
                category = "solar"
              }

              return {
                name,
                path,
                Component: component.default,
                category,
              }
            } catch (error) {
              console.error(`Failed to load icon from ${path}:`, error)
              return null
            }
          },
        )

        const loadedIcons = (await Promise.all(iconPromises)).filter(
          Boolean,
        ) as IconItem[]
        setIcons(loadedIcons)
      } catch (error) {
        console.error("Failed to load icons:", error)
      } finally {
        setLoading(false)
      }
    }

    loadIcons()
  }, [])

  // Filter icons based on search term and category
  const filteredIcons = icons.filter((icon) => {
    const matchesSearch = icon.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || icon.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = ["all", ...new Set(icons.map((icon) => icon.category))]

  // Copy icon import path to clipboard
  const copyIconImport = (icon: IconItem): void => {
    const importPath = `import ${icon.name} from "webui-library/src/icons${
      icon.category !== "default" ? `/${icon.category}` : ""
    }/${icon.name}"`

    navigator.clipboard.writeText(importPath)
    alert(`Copied import statement to clipboard: \n${importPath}`)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <header className="mb-8">
          <h1 className="mb-2 font-bold text-3xl">Icon Gallery</h1>
          <p className="mb-4 text-gray-600">Loading icons...</p>
        </header>
      </div>
    )
  }

  return (
    <div className="mx-auto h-full max-w-6xl p-8">
      <div className="sticky top-0">
        <header className="mb-8">
          <h1 className="mb-2 font-bold text-3xl">Icon Gallery</h1>
          <p className="mb-4 text-gray-600">
            Browse and search all available icons from the webui-library
            package. Click on an icon to copy its import statement.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap gap-4">
          <select
            className="rounded-md border border-gray-300 p-3 text-base"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search icons..."
            className="w-full rounded-md border border-gray-300 p-3 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6">
        {filteredIcons.map((icon) => (
          <Button
            variant="plain"
            key={icon.path}
            onPress={() => copyIconImport(icon)}
            className="hover:-translate-y-0.5 flex cursor-pointer flex-col items-center rounded-lg border border-gray-200 p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
          >
            <div className="mb-4 flex h-[50px] w-[50px] items-center justify-center text-gray-800">
              {icon.Component ? <icon.Component /> : null}
            </div>
            <span className="break-words text-center text-sm">{icon.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
