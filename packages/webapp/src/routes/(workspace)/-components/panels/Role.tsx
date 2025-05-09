import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { type FieldValues, useForm } from "react-hook-form"
import type { GetRole200Response } from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import Add from "webui-library/src/icons/Add"
import LinkIcon from "webui-library/src/icons/Link"
import ListBox from "webui-library/src/list-box"
import ListBoxItem from "webui-library/src/list-box-item"
import Menu from "webui-library/src/widgets/menu"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useSyncEntityForm } from "~/core/workspace/entities/hooks"
import EntityLayoutRte from "./components/EntityLayoutRte"
import EntityLayout from "./components/entity-layout"

interface Props {
  id: string
}

const RoleWithData = ({ id, data }: Props & { data: GetRole200Response }) => {
  const form = useForm<FieldValues>({
    defaultValues: data,
  })
  const api = useWorkspaceApi()
  const queryKey = [api.role.getRole.name, id]
  const { data: openings } = useQuery({
    queryKey: [api.opening.getOpenings.name],
    queryFn: async () => {
      return api.opening.getOpenings()
    },
  })
  const [expandedOpenings, setExpandedOpenings] = useState(false)
  useSyncEntityForm({ form, data })

  return (
    <EntityLayout
      id={data.id}
      entityType="Role"
      title={data.title}
      builtInAttributes={[]}
      createdAt={data.createdAt ?? ""}
      form={form}
    >
      <EntityLayoutRte
        {...(data?.description?.html
          ? { defaultContent: data?.description?.html }
          : {})}
        html={data.description?.html ?? ""}
        onBlur={async ({ editor }) => {
          const data = {
            html: editor.getHTML(),
            json: editor.getJSON(),
          }
          await api.role.updateARole({
            id,
            updateARoleRequest: { description: data },
          })
          queryClient.invalidateQueries({ queryKey })
          // updateView({ expandedDescription: false })
        }}
      />
      <div className="mx-6 border-gray-100 border-t border-solid" />
      <div className="px-6 py-2">
        <div className="flex items-center justify-between">
          <h3 className=" text-gray-400">
            <span>Openings</span>
          </h3>
          {openings?.length === 0 ? (
            <Link
              to=""
              search={{ drw: { id: "cr8op", r: id } }}
              className="inline-flex h-6 items-center rounded-md text-gray-500 text-xs leading-7"
            >
              <LinkIcon strokeWidth={0.8} className="mr-1" />
              <span>Add an opening</span>
            </Link>
          ) : (
            <Menu
              triggerButton={{
                className:
                  "inline-flex h-6 items-center rounded-md text-gray-500 text-xs leading-7",
                children: (
                  <>
                    <LinkIcon strokeWidth={0.8} className="mr-1" />
                    <span>Add an opening</span>
                  </>
                ),
                onPress: () => setExpandedOpenings(true),
              }}
              popover={{
                isOpen: expandedOpenings,
                onOpenChange: setExpandedOpenings,
                placement: "bottom right",
                children: (
                  <div className="w-72 rounded-lg bg-white shadow">
                    <ListBox
                      onAction={async (key) => {
                        const id = key as string
                        await api.opening.updateAnOpening({
                          id: id,
                          updateAnOpeningRequest: {
                            role: data.id,
                          },
                        })
                        await Promise.all([
                          queryClient.invalidateQueries({ queryKey }),
                          queryClient.invalidateQueries({
                            queryKey: [api.role.getRoles.name],
                          }),
                          queryClient.invalidateQueries({
                            queryKey: [api.opening.getOpenings.name],
                          }),
                        ])
                      }}
                    >
                      {openings?.map((opening) => {
                        const { id, title } = opening

                        return (
                          <ListBoxItem
                            key={id}
                            id={id}
                            className="border-gray-100 border-b px-2 py-1.5"
                          >
                            {title}
                          </ListBoxItem>
                        )
                      })}
                    </ListBox>
                    <div className="flex items-center justify-between p-2">
                      <Link
                        to=""
                        search={{ drw: { id: "cr8op", r: id } }}
                        className="inline-flex items-center gap-x-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs "
                      >
                        <Add />
                        <span>New opening</span>
                      </Link>
                      <Button
                        variant="plain"
                        className="px-2 py-1 text-xs"
                        onPress={() => {
                          setExpandedOpenings(false)
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                ),
              }}
            />
          )}
        </div>
        {data.openings.length ? (
          <div className="mt-2 flex flex-col gap-y-2">
            {data.openings.map(({ id }) => {
              const opening = openings?.find((opening) => opening.id === id)
              if (!opening) return null
              return (
                <Link
                  key={id}
                  to=""
                  search={{
                    drw: {
                      id: "op",
                      e: id,
                    },
                  }}
                  className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-2"
                >
                  <div className="flex-1">{opening.title}</div>
                  {/* <Button
                    variant="plain"
                    className="text-red-500 text-xs"
                    onPress={() =>
                      setSelectedOpenings((selected) =>
                        selected.filter((_id) => _id !== id),
                      )
                    }
                  >
                    <X />
                  </Button> */}
                </Link>
              )
            })}
          </div>
        ) : null}
      </div>
      <div className="mx-6 border-gray-100 border-t border-solid" />
    </EntityLayout>
  )
  // return (
  //   <div className="flex w-[32rem] flex-1 flex-col gap-y-3 overflow-y-auto">
  //     <h2 className="mt-4 border-none px-6 text-2xl outline-none">
  //       {data?.title}
  //     </h2>
  //     <FieldsSection role={data as IRole} onValueUpdate={onValueUpdate} />
  //     <div className="mx-6 border-gray-200 border-t border-solid" />
  //     <div className="relative px-6 py-2">
  //       <button
  //         onClick={() => {
  //           updateView((view) => ({
  //             ...view,
  //             expandedDescription: !view.expandedDescription,
  //           }))
  //         }}
  //         className="static mb-4"
  //         type="button"
  //       >
  //         <h3 className="flex items-center gap-x-1 text-gray-400">
  //           <span>Description</span>
  //           <CaretRight
  //             width={12}
  //             className={`transition duration-150 ${view.expandedDescription ? "rotate-90" : ""}`}
  //           />
  //         </h3>
  //         {view.expandedDescription ? null : (
  //           <div className="absolute inset-0 z-10" />
  //         )}
  //       </button>
  //       <div
  //         className={`prose-headings:text-gray-600 text-gray-600 ${view.expandedDescription ? "" : "line-clamp-6 overflow-hidden text-ellipsis [mask-image:_linear-gradient(#fff,_transparent)]"}`}
  //       >
  //         <RTE
  //           defaultContent={data?.description?.html}
  //           editorProps={{
  //             attributes: view.expandedDescription ? {} : { tabIndex: "-1" },
  //           }}
  //           onBlur={async ({ editor }) => {
  //             const data = {
  //               html: editor.getHTML(),
  //               json: editor.getJSON(),
  //             }
  //             await api.role.updateARole({
  //               id,
  //               updateARoleRequest: { description: data },
  //             })
  //             queryClient.invalidateQueries({ queryKey })
  //             updateView({ expandedDescription: false })
  //           }}
  //         />
  //       </div>
  //     </div>
  //     <div className="mx-6 border-gray-100 border-t border-solid" />
  //     <div className="px-6 py-2">
  //       <div className="flex items-center justify-between">
  //         <h3 className=" text-gray-400">
  //           <span>Openings</span>
  //         </h3>
  //         <Menu
  //           triggerButton={{
  //             className:
  //               "inline-flex h-6 items-center rounded-md text-gray-500 text-xs leading-7",
  //             children: (
  //               <>
  //                 <LinkIcon strokeWidth={0.8} className="mr-1" />
  //                 <span>Add an opening</span>
  //               </>
  //             ),
  //           }}
  //           popover={{
  //             isOpen: expandedOpenings,
  //             onOpenChange: setExpandedOpenings,
  //             placement: "bottom right",
  //             children: (
  //               <div className="w-72 rounded-lg bg-white shadow">
  //                 <ListBox
  //                   onAction={async (key) => {
  //                     const id = key as string
  //                     await api.opening.updateAnOpening({
  //                       id: id,
  //                       updateAnOpeningRequest: {
  //                         role: data.id,
  //                       },
  //                     })
  //                     await Promise.all([
  //                       queryClient.invalidateQueries({ queryKey }),
  //                       queryClient.invalidateQueries({
  //                         queryKey: [api.role.getRoles.name],
  //                       }),
  //                       queryClient.invalidateQueries({
  //                         queryKey: [api.opening.getOpenings.name],
  //                       }),
  //                     ])
  //                   }}
  //                 >
  //                   {openings?.map((opening) => {
  //                     const { id, title } = opening

  //                     return (
  //                       <ListBoxItem
  //                         key={id}
  //                         id={id}
  //                         className="border-gray-100 border-b px-2 py-1.5"
  //                       >
  //                         {title}
  //                       </ListBoxItem>
  //                     )
  //                   })}
  //                 </ListBox>
  //                 <div className="flex items-center justify-between p-2">
  //                   <Link
  //                     to=""
  //                     search={{ drw: { id: "cr8op", r: id } }}
  //                     className="inline-flex items-center gap-x-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs "
  //                   >
  //                     <Add />
  //                     <span>New opening</span>
  //                   </Link>
  //                   <Button
  //                     variant="plain"
  //                     className="px-2 py-1 text-xs"
  //                     onPress={() => {
  //                       setExpandedOpenings(false)
  //                     }}
  //                   >
  //                     Close
  //                   </Button>
  //                 </div>
  //               </div>
  //             ),
  //           }}
  //         />
  //       </div>
  //       {/* <OpeningsSelector
  //         placement="bottom left"
  //         selection={[]}
  //         onChange={() => {}}
  //       /> */}
  //       {data.openings.length ? (
  //         <div className="mt-2 flex flex-col gap-y-2">
  //           {data.openings.map(({ id }) => {
  //             const opening = openings?.find((opening) => opening.id === id)
  //             if (!opening) return null
  //             return (
  //               <Link
  //                 key={id}
  //                 to=""
  //                 search={{
  //                   drw: {
  //                     id: "op",
  //                     e: id,
  //                   },
  //                 }}
  //                 className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-2"
  //               >
  //                 <div className="flex-1">{opening.title}</div>
  //                 {/* <Button
  //                   variant="plain"
  //                   className="text-red-500 text-xs"
  //                   onPress={() =>
  //                     setSelectedOpenings((selected) =>
  //                       selected.filter((_id) => _id !== id),
  //                     )
  //                   }
  //                 >
  //                   <X />
  //                 </Button> */}
  //               </Link>
  //             )
  //           })}
  //         </div>
  //       ) : null}
  //     </div>
  //     <div className="mx-6 border-gray-100 border-t border-solid" />
  //     {/* <div className="px-6 py-2">
  //       <div className="flex items-center justify-between gap-x-1 text-gray-400">
  //         <h3 className="">
  //           <span>Hiring processes</span>
  //         </h3>
  //         <Menu
  //           triggerButton={{
  //             className:
  //               "mt-2 inline-flex h-6 items-center rounded-md text-gray-500 text-xs leading-7",
  //             children: (
  //               <>
  //                 <LinkIcon strokeWidth={0.8} className="mr-1" />
  //                 <span>Add a process</span>
  //               </>
  //             ),
  //           }}
  //           popover={{
  //             placement: "bottom right",
  //             children: (
  //               <div className="w-72 rounded-lg bg-white shadow">
  //                 <ListBox
  //                   onAction={async (key) => {
  //                     // const id = key as string
  //                     // await api.opening.updateAnOpening({
  //                     //   id: id,
  //                     //   updateAnOpeningRequest: {
  //                     //     role: data.id,
  //                     //   },
  //                     // })
  //                     // await Promise.all([
  //                     //   queryClient.invalidateQueries({ queryKey }),
  //                     //   queryClient.invalidateQueries({
  //                     //     queryKey: [api.role.getRoles.name],
  //                     //   }),
  //                     //   queryClient.invalidateQueries({
  //                     //     queryKey: [api.opening.getOpenings.name],
  //                     //   }),
  //                     // ])
  //                   }}
  //                 >
  //                   {workflows?.map((workflow) => {
  //                     const { id, name } = workflow

  //                     return (
  //                       <ListBoxItem
  //                         key={id}
  //                         id={id}
  //                         className="border-gray-100 border-b px-2 py-1.5"
  //                       >
  //                         {name}
  //                       </ListBoxItem>
  //                     )
  //                   })}
  //                 </ListBox>
  //                 <div className="flex items-center justify-between p-2">
  //                   <Link
  //                     to="/w/$code/processes/create"
  //                     params={{ code: workspace.url }}
  //                     className="inline-flex items-center gap-x-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs "
  //                   >
  //                     <Add />
  //                     <span>New process</span>
  //                   </Link>
  //                   <Button variant="plain" className="px-2 py-1 text-xs">
  //                     Close
  //                   </Button>
  //                 </div>
  //               </div>
  //             ),
  //           }}
  //         />
  //       </div>
  //     </div> */}
  //   </div>
  // )
}

const Role = ({ id }: Props) => {
  const api = useWorkspaceApi()
  const queryKey = [api.role.getRole.name, id]
  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const role = await api.role.getRole({ id })
      return role
    },
  })

  if (!data) return <div className="3xl:w-[36rem] w-[28rem] 2xl:w-[32rem]" />

  return <RoleWithData data={data} id={id} />
}

export default Role
