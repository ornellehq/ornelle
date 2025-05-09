import { Link } from "@tanstack/react-router"
import { useId } from "react"
import Breadcrumbs from "webui-library/src/breadcrumbs"
import { Button } from "webui-library/src/button"
import Layers from "webui-library/src/icons/Layers"
import SearchINSquare from "webui-library/src/icons/SearchInSquare"
import Tab from "webui-library/src/tab"
import Tabs from "webui-library/src/tabs"
import TabList from "webui-library/src/tabs-list"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { cn } from "webui-library/src/utils/cn"
import { useWorkspaceContext } from "~/core/workspace/workspace.context"
import type { BreadCrumb } from "~/types"
import Favorite from "~icons/hugeicons/star"
import StickyNote from "~icons/hugeicons/sticky-note-02"
import ThreeDotsHorizontal from "~icons/solar/menu-dots-bold"

interface ITab {
  id: string
  title: string
  link: string
  icon: React.ReactElement
}

interface TopBarProps {
  breadCrumbs: BreadCrumb[]
  hide?: ("more" | "new")[]
  onViewNameChange?(viewName: string): void
  viewName?: string
  rightEl?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
}

const TopBar = ({
  breadCrumbs,
  hide = [],
  onViewNameChange,
  viewName,
  rightEl,
}: TopBarProps) => {
  const { appState } = useWorkspaceContext()
  const tabs: ITab[] = [
    {
      id: useId(),
      title: "Overview",
      link: "",
      icon: <StickyNote />,
    },
    {
      id: useId(),
      title: "Openings",
      link: "",
      icon: <SearchINSquare />,
    },
    {
      id: useId(),
      title: "Applications",
      link: "",
      icon: <Layers />,
    },
    {
      id: useId(),
      title: "All roles",
      link: "",
      icon: <Layers />,
    },
  ].slice(0, 3)
  const hasOneTab = tabs.length === 1
  const isNewView = appState.entityView === "new"

  return (
    <header className="flex h-10 shrink-0 items-center justify-between border-gray-100 border-b border-solid pr-3 pl-6">
      <div className="flex items-center gap-x-3">
        {isNewView ? (
          <TextFieldInput
            autoFocus
            variant="plain"
            placeholder="Untitled view"
            value={viewName}
            onChange={(ev) => onViewNameChange?.(ev.target.value)}
            className="w-fit min-w-72"
          />
        ) : (
          <Breadcrumbs breadcrumbs={breadCrumbs} className="shrink-0" />
        )}
        {hide.includes("more") ? null : (
          <Button variant={"plain"} className="hidden">
            <ThreeDotsHorizontal />
          </Button>
        )}
        <Button variant={"plain"} className="hidden">
          <Favorite />
        </Button>
      </div>
      <div className="hidden flex-1 pl-3">
        <Tabs orientation="horizontal">
          <TabList
            className={`flex h-6 items-center rounded-md text-xs ${hasOneTab ? "" : "border border-gray-200 border-solid"}`}
          >
            {tabs.map(({ id, title, link, icon }) => {
              return (
                <Tab
                  key={id}
                  className={cn(
                    "relative h-6 rounded-md px-2 text-slate-600 leading-6 after:top-0 after:left-0 after:h-full after:w-full after:rounded-md after:border-gray-300 data-[selected]:bg-gray-100 data-[selected]:text-black data-[selected]:after:absolute data-[selected]:after:block data-[selected]:after:border",
                    hasOneTab
                      ? ""
                      : "first:after:left-[-1px] last:after:left-[1px]",
                  )}
                >
                  <Link to={link} className="flex items-center gap-x-1">
                    {icon}
                    <span>{title}</span>
                  </Link>
                </Tab>
              )
            })}
          </TabList>
        </Tabs>
      </div>
      <div
        {...rightEl}
        className={cn(
          "flex flex-1 items-center justify-end",
          rightEl?.className,
        )}
      />
      {/* {hide.includes("new") || isNewView ? null : (
        <motion.div
          layout
          transition={{ duration: 0.1 }}
          className="flex justify-end"
        >
          <CreateRecordPicker />
        </motion.div>
      )} */}
    </header>
  )
}

export default TopBar

/**
 * Role -> Overview, Openings, Applications
 */
