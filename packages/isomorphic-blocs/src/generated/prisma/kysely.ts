import type { ColumnType } from "kysely"
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export const OpeningStatus = {
  Published: "Published",
  Draft: "Draft",
} as const
export type OpeningStatus = (typeof OpeningStatus)[keyof typeof OpeningStatus]
export const ApplicationStatusCategory = {
  NotStarted: "NotStarted",
  Started: "Started",
  Completed: "Completed",
  Rejected: "Rejected",
} as const
export type ApplicationStatusCategory =
  (typeof ApplicationStatusCategory)[keyof typeof ApplicationStatusCategory]
export const EntityType = {
  Role: "Role",
  Opening: "Opening",
  Application: "Application",
  Candidate: "Candidate",
  Custom: "Custom",
} as const
export type EntityType = (typeof EntityType)[keyof typeof EntityType]
export const AttributeDataType = {
  Text: "Text",
  Number: "Number",
  Toggle: "Toggle",
  Select: "Select",
  Date: "Date",
  Email: "Email",
  URL: "URL",
  File: "File",
  Phone: "Phone",
  Record: "Record",
  Range: "Range",
  Location: "Location",
  Member: "Member",
} as const
export type AttributeDataType =
  (typeof AttributeDataType)[keyof typeof AttributeDataType]
export const ReviewStatus = {
  Pending: "Pending",
  Approved: "Approved",
  Rejected: "Rejected",
} as const
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus]
export const ActionSource = {
  Profile: "Profile",
  Candidate: "Candidate",
} as const
export type ActionSource = (typeof ActionSource)[keyof typeof ActionSource]
export const FormType = {
  Application: "Application",
  Review: "Review",
} as const
export type FormType = (typeof FormType)[keyof typeof FormType]
export const EmailTemplateType = {
  Application: "Application",
} as const
export type EmailTemplateType =
  (typeof EmailTemplateType)[keyof typeof EmailTemplateType]
export const ActivityType = {
  AttributeUpdate: "AttributeUpdate",
  ConversationCreated: "ConversationCreated",
  ConversationStatusChanged: "ConversationStatusChanged",
  MessageSent: "MessageSent",
  EmailSent: "EmailSent",
  EmailReceived: "EmailReceived",
  ApplicationStatusUpdate: "ApplicationStatusUpdate",
  ReviewRecommended: "ReviewRecommended",
  ReviewRejected: "ReviewRejected",
} as const
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType]
export const ConversationStatus = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  LOCKED: "LOCKED",
} as const
export type ConversationStatus =
  (typeof ConversationStatus)[keyof typeof ConversationStatus]
export const MessageStatus = {
  DRAFT: "DRAFT",
  SENDING: "SENDING",
  SENT: "SENT",
  PUBLISHED: "PUBLISHED",
  DELIVERED: "DELIVERED",
  FAILED: "FAILED",
  BOUNCED: "BOUNCED",
  ARCHIVED: "ARCHIVED",
} as const
export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus]
export const MessageType = {
  EMAIL_OUTBOUND: "EMAIL_OUTBOUND",
  EMAIL_INBOUND: "EMAIL_INBOUND",
  INTERNAL_MESSAGE: "INTERNAL_MESSAGE",
  INTERNAL_RESPONSE: "INTERNAL_RESPONSE",
  PLATFORM: "PLATFORM",
} as const
export type MessageType = (typeof MessageType)[keyof typeof MessageType]
export type Activity = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  workspaceId: string
  sourceId: string
  entityId: string | null
  entityType: EntityType
  source: ActionSource
  previousValue: unknown | null
  newValue: unknown | null
  metadata: unknown | null
  type: Generated<ActivityType>
  causedById: string | null
}
export type Application = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  resumeLink: string
  resumeText: string
  resumeData: Generated<unknown>
  workspaceId: string
  openingId: string
  candidateId: string
  creatorId: string | null
  statusId: string | null
  numberInWorkspace: number
  /**
   * [RTEContent]
   */
  notes: Generated<unknown>
  /**
   * [FormResponses]
   */
  responses: unknown
  deletedAt: Timestamp | null
}
export type ApplicationStatus = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  name: string
  workspaceId: string
  category: ApplicationStatusCategory
  isOutOfTheBox: Generated<boolean>
  color: string | null
  description: Generated<string>
}
export type Attribute = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  entityType: EntityType
  name: string
  dataType: AttributeDataType
  workspaceId: string
  creatorId: string
  entityId: string | null
  builtIn: boolean
  configuration: Generated<unknown>
}
export type AttributeValue = {
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  entityId: string
  attributeId: string
  workspaceId: string
  data: Generated<unknown>
}
export type Candidate = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  firstName: string
  lastName: string
  email: string
  workspaceId: string
  creatorId: string | null
  numberInWorkspace: number
  deletedAt: Timestamp | null
}
export type Conversation = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  title: string
  status: Generated<ConversationStatus>
  workspaceId: string
  applicationId: string | null
  candidateId: string | null
  creatorId: string | null
}
export type EmailAddress = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  deletedAt: Timestamp | null
  workspaceId: string
  profileId: string
  email: string
  isActive: Generated<boolean>
}
export type EmailTemplate = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  name: string
  description: string
  workspaceId: string
  deletedAt: Timestamp | null
  subject: Generated<string>
  type: Generated<EmailTemplateType>
  /**
   * [RTEContent]
   */
  content: Generated<unknown>
}
export type Entity = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  name: string
  workspaceId: string
}
export type File = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  name: string
  slug: string
  path: string
  size: number
  mime: string
  checksum: string | null
  workspaceId: string
}
export type Form = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  name: string
  description: string
  workspaceId: string
  authorId: string
  type: Generated<FormType>
  content: Generated<unknown>
  deletedAt: Timestamp | null
}
export type ListingTheme = {
  key: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  name: string
  workspaceId: string
  openingsConfig: unknown
  openingConfig: unknown
  active: Generated<boolean>
}
export type Message = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  deletedAt: Timestamp | null
  type: MessageType
  status: Generated<MessageStatus>
  content: string
  applicationId: string | null
  fromCandidateId: string | null
  conversationId: string | null
  workspaceId: string
  authorId: string | null
  parentId: string | null
  metadata: unknown | null
  attachments: Generated<unknown>
  subject: string | null
  fromEmail: string | null
  toEmails: string[]
  ccEmails: string[]
  bccEmails: string[]
}
export type Opening = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  title: string
  /**
   * [RTEContent]
   */
  description: Generated<unknown>
  workspaceId: string
  roleId: string
  formId: string | null
  status: Generated<OpeningStatus>
  deletedAt: Timestamp | null
}
export type Profile = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  displayName: string | null
  firstName: string
  lastName: string
  userId: string
  pictureSlug: string | null
  deactivated: Timestamp | null
  workspaceId: string
  savedFolderId: string | null
  savedId: string | null
}
export type Review = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  workspaceId: string
  applicationId: string
  authorId: string
  responses: unknown
  description: Generated<string>
  status: Generated<ReviewStatus>
  source: ActionSource
  sourceId: string
  formId: string | null
}
export type Role = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  title: string
  /**
   * [RTEContent]
   */
  description: Generated<unknown>
  workspaceId: string
  deletedAt: Timestamp | null
}
export type Saved = {
  id: string
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  name: string | null
  creatorId: string
  workspaceId: string
  entityId: string
  entityType: string
  folderId: string | null
  isSharedWithWorkspace: Generated<boolean>
}
export type SavedFolder = {
  id: string
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  name: string
  creatorId: string
  workspaceId: string
  isSharedWithWorkspace: Generated<boolean>
  parentId: string | null
}
export type User = {
  id: string
  email: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  firstName: string
  deletedAt: Timestamp | null
}
export type View = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  name: string
  description: string | null
  workspaceId: string
  creatorId: string
  folderId: string | null
  public: boolean
  entityType: EntityType
  config: Generated<unknown>
}
export type Workspace = {
  id: string
  updatedAt: Timestamp
  createdAt: Generated<Timestamp>
  url: string
  name: string
  logoSlug: string | null
  creatorId: string
  onboarding: Generated<unknown>
}
export type DB = {
  Activity: Activity
  Application: Application
  ApplicationStatus: ApplicationStatus
  Attribute: Attribute
  AttributeValue: AttributeValue
  Candidate: Candidate
  Conversation: Conversation
  EmailAddress: EmailAddress
  EmailTemplate: EmailTemplate
  Entity: Entity
  File: File
  Form: Form
  ListingTheme: ListingTheme
  Message: Message
  Opening: Opening
  Profile: Profile
  Review: Review
  Role: Role
  Saved: Saved
  SavedFolder: SavedFolder
  User: User
  View: View
  Workspace: Workspace
}
