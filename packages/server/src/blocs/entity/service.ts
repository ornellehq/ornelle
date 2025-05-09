// @ts-nocheck
import type {
  AttributeDataType,
  AttributeValue,
  Candidate,
  DB,
} from "isomorphic-blocs/src/kysely"
import type {
  Filter,
  Operator,
  SelectedFilter,
} from "isomorphic-blocs/src/types/conditions"
import type { EntityContract } from "isomorphic-blocs/src/types/contracts"
import {
  type BINARY_OPERATORS,
  type ExpressionBuilder,
  type ExpressionWrapper,
  type RawBuilder,
  sql,
} from "kysely"

const operatorToSqlMap: Partial<
  Record<Operator, (typeof BINARY_OPERATORS)[number]>
> = {
  eq: "=",
  notEq: "!=",
  contains: "ilike",
  notContains: "not ilike",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  isNull: "is",
  isNotNull: "is not",
  in: "in",
  notIn: "not in",
  before: "<",
  after: ">=",
}

type WhereFn = (
  eb: ExpressionBuilder<
    DB & {
      av: AttributeValue | Candidate
    },
    "av"
  >,
  info: { valueExp: RawBuilder<unknown>; filter: Filter & SelectedFilter },
) =>
  | ExpressionWrapper<
      DB & {
        e: AttributeValue | Candidate
      },
      "e",
      unknown
    >
  | undefined
const textsWhereFn: WhereFn = (eb, { filter, valueExp }) => {
  const sqlOperator = operatorToSqlMap[filter.operator]
  if (!sqlOperator) return undefined

  const value = (filter.value as string).toLowerCase()

  return eb(
    filter.origin === "system"
      ? sql`LOWER(${sql.ref(filter.id)})`
      : sql`LOWER(av.data->>'value')`,
    sqlOperator,
    ["contains", "notContains"].includes(filter.operator)
      ? `%${value}%`
      : value,
  )
}

const defaultWhereFn: WhereFn = (eb, { valueExp, filter }) => {
  const sqlOperator = operatorToSqlMap[filter.operator]
  if (!sqlOperator) return undefined

  if (filter.operator === "notContains")
    return eb.or([
      eb(valueExp, "not ilike", `%${filter.value}%`),
      eb(valueExp, "is", null),
    ])

  return eb(
    valueExp,
    sqlOperator,
    "contains" === filter.operator
      ? `%${filter.value}%`
      : ["isNull", "isNotNull"].includes(filter.operator)
        ? null
        : filter.value,
  )
}

// Add specialized handler for Select data type to fix issues with notEq, notContains, and isNotNull operators
const selectWhereFn: WhereFn = (eb, { filter, valueExp }) => {
  if (filter.operator === "notEq") {
    // Include nulls in notEq comparison (A != B OR A IS NULL)
    return eb.or([
      eb(valueExp, "!=", filter.value),
      eb(valueExp, "is", null),
      eb(valueExp, "=", ""),
    ])
  }

  if (filter.operator === "notContains") {
    // Special case for notContains on Select type
    const value = `%${(filter.value as string).toLowerCase()}%`
    return eb.or([
      eb(
        filter.origin === "system"
          ? sql`LOWER(${sql.ref(filter.id)})`
          : sql`LOWER(av.data->>'value')`,
        "not ilike",
        value,
      ),
      eb(valueExp, "is", null),
    ])
  }

  // For other operators, use the default text handler
  return textsWhereFn(eb, { filter, valueExp })
}

const attributeTypeWhereFnMap: Partial<Record<AttributeDataType, WhereFn>> = {
  Text: textsWhereFn,
  Email: textsWhereFn,
  URL: textsWhereFn,
  Phone: textsWhereFn,
  Select: selectWhereFn,
}

const isJsonField = (entityType: string, fieldName: string): boolean => {
  const jsonFields: Record<string, string[]> = {
    Role: ["description"],
    Opening: ["description"],
    Application: ["notes", "responses"],
  }

  return jsonFields[entityType]?.includes(fieldName) || false
}

const relationForeignKeyIdsMap: Record<string, string> = {
  ApplicationStatus: "statusId",
  Candidate: "candidateId",
  Opening: "openingId",
  Role: "roleId",
}

export class EntityService implements EntityContract {
  constructor(private fastify: FastifyWithSchemaProvider) {}

  mergeAttributes: EntityContract["mergeAttributes"] = async (
    entities,
    entityType,
  ) => {
    const attributeValues = await this.fastify.prisma.attributeValue.findMany({
      where: {
        // workspace: {
        //   url,
        // },
        entityId: {
          in: entities.map((entity) => entity.id),
        },
        attribute: {
          entityType: {
            equals: entityType,
          },
        },
      },
      include: {
        attribute: {
          select: {
            dataType: true,
          },
        },
      },
    })

    const entitiesWithAttributes = entities.map((entity) => {
      const values = attributeValues
        .filter((value) => value.entityId === entity.id)
        .reduce((acc, value) => {
          const dataType = value.attribute.dataType
          return Object.assign(acc, {
            [value.attributeId]: [
              "Text",
              "Number",
              "Date",
              "Toggle",
              "Select",
              "URL",
              "Email",
              "Member",
            ].includes(dataType)
              ? (value.data as { value: string }).value
              : value.data,
          })
        }, {})

      return {
        ...entity,
        ...values,
      }
    })

    return entitiesWithAttributes
  }

  findEntities: EntityContract["findEntities"] = ({
    entityType,
    options,
    qb,
  }) => {
    const db = this.fastify.kysely
    const { filters, sorts } = options

    const entityFieldNames = Object.keys(
      // @ts-ignore
      this.fastify.prisma[entityType.toLowerCase()]?.fields ?? {},
    )

    // Separate filters into built-in fields, custom fields, and relation fields
    const builtInFieldFilters = filters.filter((filter) =>
      entityFieldNames.includes(filter.id),
    )
    const relationFilters = filters.filter((filter) => filter.id.includes("."))
    const customFieldFilters = filters.filter(
      (filter) =>
        !entityFieldNames.includes(filter.id) && !filter.id.includes("."),
    )

    let query = qb

    if (customFieldFilters.length) {
      for (const filter of customFieldFilters) {
        query = query.where((eb) => {
          const avQuery = db
            .selectFrom("AttributeValue as av")
            .where("entityId", "=", sql`e.id`)
            .where("attributeId", "=", filter.id)
          const valueExp = sql`av.data->>'value'`

          if (filter.operator === "isNull") {
            // For "is empty" filters, check for non-existent values or empty (null, "") values
            return eb.or([
              eb.not((eb) => eb.exists(avQuery)),
              eb.exists(
                avQuery.where((eb) =>
                  eb.or([eb(valueExp, "is", null), eb(valueExp, "=", "")]),
                ),
              ),
            ])
          }

          if (filter.operator === "isNotNull") {
            return eb.exists(avQuery)
          }

          const exists = eb.exists(
            avQuery.where((eb) => {
              const whereFn =
                attributeTypeWhereFnMap[filter.type as AttributeDataType]
              const info = {
                filter: {
                  ...filter,
                  ...(filter.type === "Toggle"
                    ? filter.operator === "isTrue"
                      ? {
                          operator: "eq",
                          value: "Yes",
                        }
                      : filter.operator === "isFalse"
                        ? {
                            operator: "eq",
                            value: "No",
                          }
                        : {}
                    : {}),
                },
                valueExp,
              }

              return (
                whereFn?.(eb, info) ?? defaultWhereFn(eb, info) ?? eb.or([])
              ) // eb("av.attributeId", "=", "")
            }),
          )

          if (
            filter.operator === "notContains" ||
            filter.operator === "notEq"
          ) {
            return eb.or([exists, eb.not((eb) => eb.exists(avQuery))])
          }

          return exists
        })
      }
    }

    if (builtInFieldFilters.length) {
      query = query.where((eb) => {
        return eb.and(
          // @ts-ignore
          builtInFieldFilters.map((filter) => {
            // Special handling for JSON fields like description
            if (isJsonField(entityType, filter.id)) {
              const sqlOperator = operatorToSqlMap[filter.operator]
              if (!sqlOperator) return eb.or([])

              // For contains/notContains, use the html field within the JSON
              if (["contains", "notContains"].includes(filter.operator)) {
                const value = `%${(filter.value as string).toLowerCase()}%`
                return eb(
                  sql`LOWER(e.${sql.ref(filter.id)}->>'html')`,
                  sqlOperator,
                  value,
                )
              }
              if (["isNull", "isNotNull"].includes(filter.operator)) {
                // For null checks on JSON fields
                return eb(
                  sql`e.${sql.ref(filter.id)}->>'html'`,
                  sqlOperator,
                  null,
                )
              }
              // For other operators
              return eb(
                sql`e.${sql.ref(filter.id)}->>'html'`,
                sqlOperator,
                (filter.value as string).toLowerCase(),
              )
            }

            // Regular fields (non-JSON)
            const whereFn =
              attributeTypeWhereFnMap[filter.type as AttributeDataType]
            const info = { filter, valueExp: filter.id }

            return whereFn?.(eb, info) ?? defaultWhereFn(eb, info) ?? eb.or([])
          }),
        )
      })
    }

    // Handle relation filters
    if (relationFilters.length) {
      // Keep track of already joined relations to avoid duplicate joins
      const joinedRelations = new Set<string>()

      for (const filter of relationFilters) {
        // Split by all dots to support nested relations
        const relationPath = filter.id.split(".")
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const field = relationPath.pop()! // Last item is the field name

        if (!field) continue

        // Build the join path and join all necessary tables
        let currentEntityType = entityType
        const joinPath = ""
        let previousTableAlias = "e"

        // Process each level of the relation path
        for (let i = 0; i < relationPath.length; i++) {
          const relationName = relationPath[i]
          const currentRelationPath = relationPath.slice(0, i + 1).join("_")
          const tableAlias = `rel_${currentRelationPath}`

          // Only join if we haven't joined this relation yet
          if (!joinedRelations.has(currentRelationPath)) {
            // Determine the proper relation table name
            // In most ORMs, the relation name in the model matches the table name (usually lowercase)
            const relationTableName = relationName.toLowerCase()

            // Get the foreign key based on the current entity and relation
            // This is a simplified approach and might need to be adjusted based on your schema
            // For common relations, the foreign key is often entityNameId (e.g., candidateId, roleId)
            const foreignKey = `${relationName}Id`

            // Join the relation table
            query = query.leftJoin(`${relationName} as ${tableAlias}`, (join) =>
              join.onRef(
                `${tableAlias}.id`,
                "=",
                `${previousTableAlias}.${relationForeignKeyIdsMap[relationName] ?? foreignKey}`,
              ),
            )

            joinedRelations.add(currentRelationPath)
          }

          previousTableAlias = `rel_${currentRelationPath}`
          currentEntityType = relationName // Update current entity type for nested relations
        }

        // Now apply the filter on the final joined table
        const finalTableAlias = `rel_${relationPath.join("_")}`

        // Check if the related field is a JSON field
        const isJsonRelationField = isJsonField(currentEntityType, field)

        // Apply the filter on the relational field
        query = query.where((eb) => {
          // If the field is JSON, access the html property
          const valueExp = isJsonRelationField
            ? sql`${sql.ref(finalTableAlias)}.${sql.ref(field)}->>'html'`
            : sql`${sql.ref(finalTableAlias)}.${sql.ref(field)}`

          // Special handling for JSON fields in relations
          if (isJsonRelationField) {
            const sqlOperator = operatorToSqlMap[filter.operator]
            if (!sqlOperator) return eb.or([])

            // For contains/notContains on JSON fields
            if (["contains", "notContains"].includes(filter.operator)) {
              const value = `%${(filter.value as string).toLowerCase()}%`
              return eb(sql`LOWER(${valueExp})`, sqlOperator, value)
            }
            if (["isNull", "isNotNull"].includes(filter.operator)) {
              return eb(valueExp, sqlOperator, null)
            }
            return eb(
              valueExp,
              sqlOperator,
              (filter.value as string).toLowerCase(),
            )
          }

          // Regular relation fields
          const whereFn =
            attributeTypeWhereFnMap[filter.type as AttributeDataType]
          const info = {
            filter: { ...filter, id: `${finalTableAlias}.${field}` },
            valueExp,
          }

          return whereFn?.(eb, info) ?? defaultWhereFn(eb, info) ?? eb.or([])
        })
      }
    }

    if (sorts.length)
      sorts?.map((sort) => {
        const attributeId = sort.id
        const direction = sort.order

        if (entityFieldNames.some((name) => name === attributeId)) {
          query = query.orderBy(attributeId, direction)
        } else if (attributeId.includes(".")) {
          // Handle sorting by relation fields
          const relationPath = attributeId.split(".")
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          const field = relationPath.pop()!

          // If we have a nested relation
          if (relationPath.length > 0) {
            const joinedRelations = new Set<string>()

            let previousTableAlias = "e"

            // Process each level of the relation path and ensure tables are joined
            for (let i = 0; i < relationPath.length; i++) {
              const relationName = relationPath[i]
              const currentRelationPath = relationPath.slice(0, i + 1).join("_")
              const tableAlias = `rel_${currentRelationPath}`

              // Only join if we haven't joined this relation yet
              if (!joinedRelations.has(currentRelationPath)) {
                const foreignKey = `${relationName}Id`

                query = query.leftJoin(
                  `${relationName} as ${tableAlias}`,
                  (join) =>
                    join.onRef(
                      `${tableAlias}.id`,
                      "=",
                      `${previousTableAlias}.${foreignKey}`,
                    ),
                )

                joinedRelations.add(currentRelationPath)
              }

              previousTableAlias = `rel_${currentRelationPath}`
            }

            // Order by the field in the final joined table
            const finalTableAlias = `rel_${relationPath.join("_")}`
            query = query.orderBy(
              sql`${sql.ref(finalTableAlias)}.${sql.ref(field)}`,
              direction,
            )
          } else {
            // Simple relation (backward compatibility)
            const relation = relationPath[0]
            const relationTableName = relation
            const tableAlias = `rel_${relation}`

            // Check if we already joined this table
            const alreadyJoined = query
              .toSQL()
              .sql.includes(`LEFT JOIN "${relation}" AS "${tableAlias}"`)

            if (!alreadyJoined) {
              query = query.leftJoin(`${relation} as ${tableAlias}`, (join) =>
                join.onRef(`${tableAlias}.id`, "=", `e.${relation}Id`),
              )
            }

            // Order by the relation field
            query = query.orderBy(
              sql`${sql.ref(tableAlias)}.${sql.ref(field)}`,
              direction,
            )
          }
        } else {
          // Custom attribute
          query = query
            .leftJoin("AttributeValue as av", (join) =>
              join
                .onRef("av.entityId", "=", "e.id")
                .on("attributeId", "=", sql`${attributeId}`),
            )
            .select(sql`av.data ->> 'value' as sort_column`)
            .orderBy(sql`sort_column`, direction)
        }
      })
    else query = query.orderBy("createdAt desc")

    return query
  }
}
