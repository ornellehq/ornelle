import { Button } from "webui-library/src/button"
import Add from "webui-library/src/icons/Add"
import Trash from "webui-library/src/icons/Trash"
import { TextFieldInput } from "webui-library/src/text-field-input"

const SelectOptions = ({
  options,
  setOptions,
}: { options: string[]; setOptions(options: string[]): void }) => {
  return (
    <div className="mb-2">
      <ul className="flex flex-col gap-y-1">
        {options.map((option, index) => {
          return (
            <li
              key={`${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
              className="flex items-center gap-x-2 rounded-md bg-slate-200 p-1"
            >
              {/* <span className="mr-1 h-1 w-1 rounded-full bg-black" /> */}
              <TextFieldInput
                variant="plain"
                value={option}
                className="h-6 flex-1 bg-white px-1.5 leading-6"
                onChange={(ev) => {
                  const value = ev.target.value
                  setOptions(
                    options.map((option, _i) =>
                      _i === index ? value : option,
                    ),
                  )
                }}
              />
              <Button
                variant={"plain"}
                onPress={() =>
                  setOptions(options.filter((_, _i) => _i !== index))
                }
                className="flex items-center justify-center rounded-md border border-gray-200"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </li>
          )
        })}
      </ul>
      <Button
        variant={"plain"}
        className="mt-1 flex items-center gap-x-1 text-[13px]"
        onPress={() => setOptions([...options, `Option ${options.length + 1}`])}
      >
        <Add className="h-4 w-4" />
        <span>Add an option</span>
      </Button>
    </div>
  )
}

export default SelectOptions
