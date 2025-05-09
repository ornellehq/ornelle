import * as cheerio from "cheerio"
import type {
  Application,
  Candidate,
  Opening,
  Role,
  Workspace,
} from "isomorphic-blocs/src/prisma"
import type {
  EmailOptions,
  EmailSendResult,
} from "lib/src/services/email/types"
import { emailClient } from "~/plugins/email"
import { prismaClient } from "~/plugins/prisma"

export const replaceEmailVariables = async (options: {
  candidateId?: string
  applicationId?: string
  openingId?: string
  roleId?: string
  workspaceId?: string
  subject: string
  body: string
}) => {
  const logger = console
  // Cache entities to avoid multiple database queries for the same entity
  const entities: Record<
    string,
    Candidate | Application | Opening | Role | Workspace | null
  > = {}
  const customAttributeValues: Record<string, unknown> = {}

  // Process email subject if it contains variables
  if (options?.subject.includes("{{")) {
    const subjectVariableRegex = /\{\{([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)\}\}/g
    let match: RegExpExecArray | null

    // Create a copy of the subject for replacement
    let processedSubject = options.subject

    // Find all matches in the subject
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    while ((match = subjectVariableRegex.exec(options.subject)) !== null) {
      const fullMatch = match[0]
      const entityType = match[1]
      const propertyName = match[2]

      // Normalize entity type to match the expected format
      const normalizedEntityType = `${entityType?.charAt(0).toUpperCase() ?? ""}${entityType?.slice(1) ?? ""}`

      // Determine entity ID based on entity type
      let entityId: string | undefined
      switch (normalizedEntityType) {
        case "Candidate":
          entityId = options.candidateId
          break
        case "Application":
          entityId = options.applicationId
          break
        case "Opening":
          entityId = options.openingId
          break
        case "Role":
          entityId = options.roleId
          break
        case "Company":
        case "Workspace":
          entityId = options.workspaceId
          break
        default:
          logger.warn(`Unknown entity type in subject variable: ${entityType}`)
          continue
      }

      if (!entityId) {
        logger.warn(
          `No ID provided for entity type in subject: ${normalizedEntityType}`,
        )
        continue
      }

      const entityKey = `${normalizedEntityType}_${entityId}`

      // Fetch entity if not already cached
      if (!entities[entityKey]) {
        try {
          let entity:
            | Candidate
            | Application
            | Opening
            | Role
            | Workspace
            | null
          switch (normalizedEntityType) {
            case "Candidate":
              entity = await prismaClient.candidate.findUnique({
                where: { id: entityId },
              })
              break
            case "Application":
              entity = await prismaClient.application.findUnique({
                where: { id: entityId },
              })
              break
            case "Opening":
              entity = await prismaClient.opening.findUnique({
                where: { id: entityId },
              })
              break
            case "Role":
              entity = await prismaClient.role.findUnique({
                where: { id: entityId },
              })
              break
            case "Company":
            case "Workspace":
              entity = await prismaClient.workspace.findUnique({
                where: { id: entityId },
              })
              break
          }

          if (entity) {
            entities[entityKey] = entity
          } else {
            logger.warn(
              `Entity not found for subject variable: ${normalizedEntityType} with ID ${entityId}`,
            )
            continue
          }
        } catch (error) {
          logger.error(
            `Error fetching entity for subject variable: ${String(error)}`,
          )
          continue
        }
      }

      const entity = entities[entityKey]
      const value = propertyName
        ? entity?.[propertyName as keyof typeof entity] || ""
        : ""

      // Replace the variable in the subject
      processedSubject = processedSubject.replace(fullMatch, String(value))
    }

    // Update the subject with processed variables
    options.subject = processedSubject
  }

  if (!options.body) {
    return { body: "", subject: options.subject }
  }

  // Load HTML with cheerio
  const $ = cheerio.load(options.body)
  const variables = $(".template-variable")

  // If no variables found, send the email as-is
  if (variables.length === 0) {
    return { body: options.body, subject: options.subject }
  }

  // Process each variable in the body
  for (const element of variables.toArray()) {
    const $element = $(element)
    const variableId = $element.attr("data-variable")
    const entityType = $element.attr("data-entity")
    const variableType = $element.attr("data-type")

    if (!variableId || !entityType || !variableType) {
      continue // Skip if missing required attributes
    }

    // Determine entity ID based on entity type
    let entityId: string | undefined
    switch (entityType) {
      case "Candidate":
        entityId = options.candidateId
        break
      case "Application":
        entityId = options.applicationId
        break
      case "Opening":
        entityId = options.openingId
        break
      case "Role":
        entityId = options.roleId
        break
      case "Company":
      case "Workspace":
        entityId = options.workspaceId
        break
      default:
        continue // Skip if entity type is not recognized
    }

    if (!entityId) {
      logger.warn(`No ID provided for entity type: ${entityType}`)
      continue // Skip if no ID is available for this entity type
    }
    const entityKey = `${entityType}_${entityId}`

    // Fetch entity if not already cached
    if (!entities[entityKey]) {
      try {
        let entity:
          | Candidate
          | Application
          | Opening
          | Role
          | Workspace
          | null = null
        switch (entityType) {
          case "Candidate":
            entity = await prismaClient.candidate.findUnique({
              where: { id: entityId },
            })
            break
          case "Application":
            entity = await prismaClient.application.findUnique({
              where: { id: entityId },
            })
            break
          case "Opening":
            entity = await prismaClient.opening.findUnique({
              where: { id: entityId },
            })
            break
          case "Role":
            entity = await prismaClient.role.findUnique({
              where: { id: entityId },
            })
            break
          case "Company":
          case "Workspace":
            entity = await prismaClient.workspace.findUnique({
              where: { id: entityId },
            })
            break
        }

        if (entity) {
          entities[entityKey] = entity
        } else {
          logger.warn(`Entity not found: ${entityType} with ID ${entityId}`)
          continue
        }
      } catch (error) {
        logger.error(`Error fetching ${entityKey}: ${String(error)}`)
        continue
      }
    }

    const entity = entities[entityKey]

    let value: unknown
    if (variableType === "built-in") {
      // Built-in properties are directly on the entity object
      value = entity?.[variableId as keyof typeof entity] || ""
    } else if (variableType === "custom") {
      // Custom attributes need to be fetched separately
      const customValueKey = `${entityKey}_${variableId}`

      if (customAttributeValues[customValueKey] === undefined) {
        try {
          const attributeValue = await prismaClient.attributeValue.findUnique({
            where: {
              attributeId_entityId: {
                attributeId: variableId,
                entityId,
              },
            },
            include: {
              attribute: true,
            },
          })

          customAttributeValues[customValueKey] =
            (attributeValue?.data as { value: string })?.value || ""
        } catch (error) {
          logger.error(
            `Error fetching custom attributes for ${entityKey}: ${String(error)}`,
          )
          continue
        }
      }

      value = customAttributeValues[customValueKey] || ""
    } else {
      continue // Skip if variable type is not recognized
    }

    // Replace the variable with the actual value
    $element.replaceWith(String(value))
  }

  // Update the email body with variables replaced
  return { body: $.html(), subject: options.subject }
}

export const sendEmailWithVariables = async (
  options: EmailOptions & {
    candidateId?: string
    applicationId?: string
    openingId?: string
    roleId?: string
    workspaceId?: string
  },
): Promise<EmailSendResult> => {
  const sendEmail = emailClient.sendEmail.bind(emailClient)
  const { body, subject } = await replaceEmailVariables(options)

  return sendEmail({
    ...options,
    body,
    subject,
  })
}
