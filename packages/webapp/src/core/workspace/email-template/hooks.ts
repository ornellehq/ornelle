import {
  GetAttributes200ResponseInnerEntityTypeEnum,
  GetAttributesEntityTypesEnum,
  GetEmailTemplates200ResponseInnerTypeEnum,
} from "sdks/src/server-sdk"
import type { BlockGroup } from "~/types/tiptap"
import { useEntityAttributes } from "../entities/hooks"

export const useEmailTemplateVariables = ({
  emailType,
}: { emailType: GetEmailTemplates200ResponseInnerTypeEnum }): {
  blocks: BlockGroup[]
  status: "pending" | "success" | "error"
} => {
  const { data: applicationAttributes, status } = useEntityAttributes([
    GetAttributesEntityTypesEnum.Candidate,
    GetAttributesEntityTypesEnum.Opening,
    GetAttributesEntityTypesEnum.Role,
  ])
  const candidateAttributes =
    applicationAttributes?.filter(
      (attribute) =>
        attribute.entityType ===
        GetAttributes200ResponseInnerEntityTypeEnum.Candidate,
    ) ?? []
  const openingAttributes =
    applicationAttributes?.filter(
      (attribute) =>
        attribute.entityType ===
        GetAttributes200ResponseInnerEntityTypeEnum.Opening,
    ) ?? []
  const roleAttributes =
    applicationAttributes?.filter(
      (attribute) =>
        attribute.entityType ===
        GetAttributes200ResponseInnerEntityTypeEnum.Role,
    ) ?? []

  return {
    blocks: [
      ...(emailType === GetEmailTemplates200ResponseInnerTypeEnum.Application
        ? []
        : ([
            {
              id: "meeting",
              name: "Meeting",
              blocks: [
                {
                  id: "link",
                  name: "Link",
                  onPress: ({ command }) => {
                    command({
                      id: "link",
                      label: "Meeting link",
                      entity: "Meeting",
                      type: "built-in",
                    })
                  },
                },
                {
                  id: "description",
                  name: "Description",
                  onPress: ({ command }) => {
                    command({
                      id: "description",
                      label: "Meeting description",
                      entity: "Meeting",
                      type: "built-in",
                    })
                  },
                },
                {
                  id: "duration",
                  name: "Duration",
                  onPress: ({ command }) => {
                    command({
                      id: "duration",
                      label: "Meeting duration",
                      entity: "Meeting",
                      type: "built-in",
                    })
                  },
                },
              ],
            },
          ] as BlockGroup[])),
      {
        id: "candidate",
        name: "Candidate",
        blocks: [
          {
            id: "firstName",
            name: "First name",
            onPress: ({ command }) => {
              command({
                id: "firstName",
                label: "Candidate's first name",
                entity: GetAttributes200ResponseInnerEntityTypeEnum.Candidate,
                type: "built-in",
              })
            },
          },
          {
            id: "lastName",
            name: "Last name",
            onPress: ({ command }) => {
              command({
                id: "lastName",
                label: "Candidate's last name",
                entity: GetAttributes200ResponseInnerEntityTypeEnum.Candidate,
                type: "built-in",
              })
            },
          },
          {
            id: "email",
            name: "Email",
            onPress: ({ command }) => {
              command({
                id: "email",
                label: "Candidate's email",
                entity: GetAttributes200ResponseInnerEntityTypeEnum.Candidate,
                type: "built-in",
              })
            },
          },
          // TODO: Add support for relation attributes
          ...candidateAttributes
            .filter((attribute) => attribute.dataType !== "Member")
            .map((attribute) => ({
              id: `${attribute.id}`,
              name: attribute.name,
              onPress: ({ command }) => {
                command({
                  id: attribute.id,
                  label: `Candidate's ${attribute.name.toLowerCase()}`,
                  entity: GetAttributes200ResponseInnerEntityTypeEnum.Candidate,
                  type: "custom",
                })
              },
            })),
        ],
      },
      {
        id: "opening",
        name: "Opening",
        blocks: [
          {
            id: "title",
            name: "Title",
            onPress: ({ command }) => {
              command({
                id: "title",
                label: "Opening's title",
                entity: GetAttributes200ResponseInnerEntityTypeEnum.Opening,
                type: "built-in",
              })
            },
          },
          // TODO: Add support for relation attributes
          ...openingAttributes
            .filter((attribute) => attribute.dataType !== "Member")
            .map((attribute) => ({
              id: `${attribute.id}`,
              name: attribute.name,
              onPress: ({ command }) => {
                command({
                  id: attribute.id,
                  label: `Opening's ${attribute.name.toLowerCase()}`,
                  entity: GetAttributes200ResponseInnerEntityTypeEnum.Opening,
                  type: "custom",
                })
              },
            })),
        ],
      },
      {
        id: "role",
        name: "Role",
        blocks: [
          {
            id: "title",
            name: "Title",
            onPress: ({ command }) => {
              command({
                id: "title",
                label: "Role's title",
                entity: GetAttributes200ResponseInnerEntityTypeEnum.Role,
                type: "built-in",
              })
            },
          },
          // TODO: Add support for relation attributes
          ...roleAttributes
            .filter((attribute) => attribute.dataType !== "Member")
            .map((attribute) => ({
              id: `${attribute.id}`,
              name: attribute.name,
              onPress: ({ command }) => {
                command({
                  id: attribute.id,
                  label: `Role's ${attribute.name.toLowerCase()}`,
                  entity: GetAttributes200ResponseInnerEntityTypeEnum.Role,
                  type: "custom",
                })
              },
            })),
        ],
      },
      {
        id: "company",
        name: "Company",
        blocks: [
          {
            id: "name",
            name: "Name",
            onPress: ({ command }) => {
              command({
                id: "name",
                label: "Company's name",
                entity: "Company",
                type: "built-in",
              })
            },
          },
        ],
      },
    ],
    status,
  }
}
