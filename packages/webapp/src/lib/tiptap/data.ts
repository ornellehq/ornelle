import type { BlockGroup } from "~/types/tiptap"
import { insertOpenings } from "./utils"

export const jobBoardContentBlockGroups: BlockGroup[] = [
  // {
  //   id: "basic",
  //   name: "Basic",
  //   blocks: [
  //     {
  //       id: "text",
  //       name: "Text",
  //     },
  //     {
  //       id: "heading-1",
  //       name: "Heading 1",
  //     },
  //     {
  //       id: "heading-2",
  //       name: "Heading 2",
  //     },
  //     {
  //       id: "heading-3",
  //       name: "Heading 3",
  //     },
  //     {
  //       id: "bulleted-list",
  //       name: "Bulleted List",
  //     },
  //     {
  //       id: "numbered-list",
  //       name: "Numbered List",
  //     },
  //   ],
  // },
  {
    id: "records",
    name: "Records",
    blocks: [
      {
        id: "openings",
        name: "Openings",
        onPress: insertOpenings,
      },
    ],
  },
]
