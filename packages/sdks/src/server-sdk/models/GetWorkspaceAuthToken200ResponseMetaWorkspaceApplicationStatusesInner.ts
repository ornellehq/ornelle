/* tslint:disable */
/* eslint-disable */
/**
 * @fastify/swagger
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 8.15.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime"
/**
 *
 * @export
 * @interface GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner
 */
export interface GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner {
  /**
   *
   * @type {string}
   * @memberof GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner
   */
  id: string
  /**
   *
   * @type {Date}
   * @memberof GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner
   */
  updatedAt: Date
  /**
   *
   * @type {Date}
   * @memberof GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner
   */
  createdAt: Date
  /**
   *
   * @type {string}
   * @memberof GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner
   */
  workspaceId: string
  /**
   *
   * @type {string}
   * @memberof GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner
   */
  category: GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInnerCategoryEnum
  /**
   *
   * @type {boolean}
   * @memberof GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner
   */
  isOutOfTheBox?: boolean
  /**
   *
   * @type {any}
   * @memberof GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner
   */
  color?: any | null
  /**
   *
   * @type {string}
   * @memberof GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner
   */
  description?: string
}

/**
 * @export
 * @enum {string}
 */
export enum GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInnerCategoryEnum {
  NotStarted = "NotStarted",
  Started = "Started",
  Completed = "Completed",
  Rejected = "Rejected",
}

/**
 * Check if a given object implements the GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner interface.
 */
export function instanceOfGetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner(
  value: object,
): boolean {
  let isInstance = true
  isInstance = isInstance && "id" in value
  isInstance = isInstance && "updatedAt" in value
  isInstance = isInstance && "createdAt" in value
  isInstance = isInstance && "name" in value
  isInstance = isInstance && "workspaceId" in value
  isInstance = isInstance && "category" in value

  return isInstance
}

export function GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInnerFromJSON(
  json: any,
): GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner {
  return GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInnerFromJSONTyped(
    json,
    false,
  )
}

export function GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: json["id"],
    updatedAt: new Date(json["updatedAt"]),
    createdAt: new Date(json["createdAt"]),
    name: json["name"],
    workspaceId: json["workspaceId"],
    category: json["category"],
    isOutOfTheBox: !exists(json, "isOutOfTheBox")
      ? undefined
      : json["isOutOfTheBox"],
    color: !exists(json, "color") ? undefined : json["color"],
    description: !exists(json, "description") ? undefined : json["description"],
  }
}

export function GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInnerToJSON(
  value?: GetWorkspaceAuthToken200ResponseMetaWorkspaceApplicationStatusesInner | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    updatedAt: value.updatedAt.toISOString(),
    createdAt: value.createdAt.toISOString(),
    name: value.name,
    workspaceId: value.workspaceId,
    category: value.category,
    isOutOfTheBox: value.isOutOfTheBox,
    color: value.color,
    description: value.description,
  }
}
