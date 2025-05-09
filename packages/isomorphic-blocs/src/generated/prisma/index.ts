import { AttributeDataType } from "@prisma/client"
import { dateFormats, timeFormats } from "lib/src/data/date"
import numberFormats from "lib/src/data/number-formats"
import { textTypes } from "lib/src/data/text"
import { toggleStyles } from "lib/src/data/toggle"
import { definitions } from "./json-schema.json"

export const rteValueSchema = {
  type: "object",
  required: ["html", "json"],
  properties: {
    html: {
      type: "string",
    },
    json: {
      type: "object",
    },
  },
} as const
export const UserSchema = definitions.User
export const WorkspaceSchema = {
  ...definitions.Workspace,
  required: [...definitions.Workspace.required, "id"],
  additionalProperties: true,
}
export const ProfileSchema = {
  ...definitions.Profile,
  required: [...definitions.Profile.required, "id"],
}
export const RoleSchema = {
  ...definitions.Role,
  required: ["id", ...definitions.Role.required],
  properties: {
    ...definitions.Role.properties,
    description: rteValueSchema,
  },
  additionalProperties: true,
} as const
export const OpeningSchema = {
  ...definitions.Opening,
  required: [...definitions.Opening.required, "createdAt", "id"] as const,
  additionalProperties: true,
  properties: {
    ...definitions.Opening.properties,
    description: rteValueSchema,
  },
} as const
export const ApplicationSchema = {
  ...definitions.Application,
  required: [...definitions.Application.required, "id", "createdAt"],
  properties: {
    ...definitions.Application.properties,
    creatorId: {
      type: "string",
    },
    notes: rteValueSchema,
    resumeData: {},
  },
  additionalProperties: true,
} as const
export const CandidateSchema = {
  ...definitions.Candidate,
  required: [...definitions.Candidate.required, "id"],
  additionalProperties: true,
} as const
export const AttributeSchema = {
  ...definitions.Attribute,
  required: [...definitions.Attribute.required, "id"],
  properties: {
    ...definitions.Attribute.properties,
    configuration: {},
  },
}
export const AttributeValueSchema = {
  ...definitions.AttributeValue,
  required: [...definitions.AttributeValue.required, "data"],
  properties: {
    ...definitions.AttributeValue.properties,
    data: {},
  },
  additionalProperties: true,
}
export const FormSchema = {
  ...definitions.Form,
  properties: {
    ...definitions.Form.properties,
    content: {},
  },
}
export const FormSchemaWithOpenings = {
  ...definitions.Form,
  required: [...definitions.Form.required, "id", "openings", "type"],
  properties: {
    ...definitions.Form.properties,
    content: {},
    openings: {
      type: "array",
      items: OpeningSchema,
    },
  },
}
export const FormFieldsSchema = {
  type: "array",
  items: {
    type: "object",
    required: ["required", "name", "id"],
    properties: {
      required: {
        type: "boolean",
      },
      name: {
        type: "string",
      },
      id: {
        type: "string",
      },
      attributeLinked: {
        type: "object",
        required: ["type", "id", "name"],
        properties: {
          type: {
            type: "string",
            // enum: ["custom", "built-in"],
          },
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
        },
      },
      type: {
        type: "string",
        // enum: [
        //   "text",
        //   "email",
        //   "file",
        //   "number",
        //   "url",
        //   "phone",
        //   "select",
        //   "date",
        // ],
      },
      options: {
        type: "array",
        items: {
          type: "string",
        },
      },
      maxSelection: {
        anyOf: [
          {
            type: "number",
          },
          {
            type: "string",
            enum: ["unlimited"],
          },
        ],
      },
      includeTime: {
        type: "boolean",
      },
      enableEndDate: {
        type: "boolean",
      },
    },
  },
} as const

export const EmailTemplateSchema = {
  ...definitions.EmailTemplate,
  required: [
    ...definitions.EmailTemplate.required,
    "id",
    "content",
    "subject",
    "type",
  ],
  properties: {
    ...definitions.EmailTemplate.properties,
    content: {},
  },
  additionalProperties: true,
}
export const ActivitySchema = {
  ...definitions.Activity,
  required: [...definitions.Activity.required, "id", "createdAt"],
  properties: {
    ...definitions.Activity.properties,
    metadata: {},
    previousValue: {},
    newValue: {},
  },
}
export const ViewSchema = {
  ...definitions.View,
  required: [...definitions.View.required, "id"],
  properties: {
    ...definitions.View.properties,
    config: {},
  },
} as const
export const EntityViewQuerySchema = {
  type: "object",
  properties: {
    filters: {
      type: "array",
      items: {
        type: "object",
      },
    },
    sorts: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "order"],
        properties: {
          id: {
            type: "string",
          },
          order: {
            type: "string",
            enum: ["asc", "desc"],
          },
        },
      },
    },
    include: {},
  },
} as const
export const ListingThemeSchema = {
  ...definitions.ListingTheme,
  required: [...definitions.ListingTheme.required, "key", "createdAt"],
  properties: {
    ...definitions.ListingTheme.properties,
    openingsConfig: {},
    openingConfig: {},
  },
} as const
export const EmailAddressSchema = {
  ...definitions.EmailAddress,
  required: [...definitions.EmailAddress.required, "id", "createdAt"],
} as const
export const MessageSchema = {
  ...definitions.Message,
  required: [...definitions.Message.required, "id", "createdAt", "metadata"],
  properties: {
    ...definitions.Message.properties,
    metadata: {},
  },
  additionalProperties: true,
} as const
export const ConversationSchema = {
  ...definitions.Conversation,
  required: [...definitions.Conversation.required, "id", "createdAt"],
} as const
export const ReviewSchema = {
  ...definitions.Review,
  required: [...definitions.Review.required, "id", "createdAt"],
  properties: {
    ...definitions.Review.properties,
    responses: {},
  },
} as const
export const ApplicationStatusSchema = {
  ...definitions.ApplicationStatus,
  required: [...definitions.ApplicationStatus.required, "id", "createdAt"],
}
export const SavedSchema = {
  ...definitions.Saved,
  required: [
    ...definitions.Saved.required,
    "id",
    "createdAt",
    "isSharedWithWorkspace",
  ],
}
export const SavedFolderSchema = {
  ...definitions.SavedFolder,
  required: [
    ...definitions.SavedFolder.required,
    "id",
    "createdAt",
    "isSharedWithWorkspace",
  ],
}
export const AttributeConfigurationSchema = {
  type: "object",
  required: ["type"],
  anyOf: [
    {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: [AttributeDataType.Text],
        },
        textType: {
          type: "string",
          enum: textTypes.map(({ id }) => id),
        },
      },
    },
    {
      type: "object",
      required: ["dateFormat", "timeFormat"],
      properties: {
        type: {
          type: "string",
          enum: [AttributeDataType.Date],
        },
        dateFormat: {
          type: "string",
          enum: dateFormats,
        },
        timeFormat: {
          type: "string",
          enum: timeFormats,
        },
      },
    },
    {
      type: "object",
      required: ["format"],
      properties: {
        type: {
          type: "string",
          enum: [AttributeDataType.Number],
        },
        format: {
          type: "string",
          enum: numberFormats,
        },
      },
    },
    {
      type: "object",
      required: ["style"],
      properties: {
        type: {
          type: "string",
          enum: [AttributeDataType.Toggle],
        },
        style: {
          type: "string",
          enum: toggleStyles,
        },
      },
    },
    {
      type: "object",
      required: ["options", "isMultiSelect"],
      properties: {
        type: {
          type: "string",
          enum: [AttributeDataType.Select],
        },
        options: {
          type: "array",
          items: {
            type: "string",
          },
        },
        isMultiSelect: {
          type: "boolean",
        },
      },
    },
    {
      type: "object",
      required: ["showFullUrl"],
      properties: {
        type: {
          type: "string",
          enum: [AttributeDataType.URL],
        },
        showFullUrl: {
          type: "boolean",
        },
      },
    },
    {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: [AttributeDataType.Email],
        },
      },
    },
    {
      type: "object",
      required: [],
      properties: {
        type: {
          type: "string",
          enum: [AttributeDataType.Member],
        },
      },
    },
  ],
} as const
