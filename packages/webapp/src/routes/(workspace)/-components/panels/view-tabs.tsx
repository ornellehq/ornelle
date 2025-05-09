import type { ReactNode } from "react"
import Tab from "webui-library/src/tab"
import Tabs from "webui-library/src/tabs"
import TabList from "webui-library/src/tabs-list"

const ViewTabs = <V extends string>({
  view,
  setView,
  tabs,
}: {
  view: V
  setView(view: V): void
  tabs: { id: string; children: ReactNode }[]
}) => {
  return (
    <Tabs
      selectedKey={view}
      onSelectionChange={(key) => {
        const view = key as V
        setView(view)
      }}
      orientation="horizontal"
      className="text-xs"
    >
      <TabList className="flex h-8 items-center rounded-lg bg-slate-200/65 px-1">
        {tabs.map(({ id, children }) => {
          return (
            <Tab
              key={id}
              id={id}
              className="relative flex h-6 items-center rounded-md px-2 text-gray-400 leading-6 outline-none focus:shadow data-[selected]:bg-white data-[selected]:text-black data-[selected]:shadow"
            >
              {children}
            </Tab>
          )
        })}
      </TabList>
    </Tabs>
  )
}

export default ViewTabs
