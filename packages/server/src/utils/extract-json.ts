export const extractJson = (str: string) => {
  const match = str.match(/^```([a-zA-Z0-9]*)\n([\s\S]*?)\n?```$/)?.[2]

  const replacedBackticks = match
    ? // Replace backticks
      match.replace(/^```[a-zA-Z0-9]*\n?|\n?```$/g, "")
    : ""

  return replacedBackticks ? JSON.parse(replacedBackticks) : {}
}
