import { Button } from "webui-library/src/button"

interface Props {
  fields: { name: string; id: string }[]
}

const BuiltInFields = ({ fields }: Props) => {
  return fields.map((property) => {
    const { id, name } = property

    return (
      <div key={id} className="flex items-center">
        <Button
          variant="plain"
          className="relative h-9 w-28 shrink-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-none px-2 text-left text-slate-500 leading-9 outline-none focus:after:absolute focus:after:inset-0 focus:after:block focus:after:rounded-sm focus:after:border-[0.5px] focus:after:border-slate-400 focus:after:border-solid focus-visible:ring-0"
        >
          {name}
        </Button>
        {/* {"value" in property ? (
          <Button
            variant="plain"
            className={`block h-9 flex-1 rounded px-2 text-left leading-9 hover:bg-gray-50 ${property.value ? "" : "text-gray-300"}`}
            onPress={() => {}}
          >
            {property.value}
          </Button>
        ) : (
          <property.ValueComponent key={id} form={form} />
        )} */}
      </div>
    )
  })
}

export default BuiltInFields
