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
 * @interface WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedBy
 */
export interface WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedBy {
  /**
   *
   * @type {string}
   * @memberof WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedBy
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedBy
   */
  firstName?: string
  /**
   *
   * @type {string}
   * @memberof WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedBy
   */
  lastName?: string
}

/**
 * Check if a given object implements the WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedBy interface.
 */
export function instanceOfWorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedBy(
  value: object,
): boolean {
  let isInstance = true

  return isInstance
}

export function WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedByFromJSON(
  json: any,
): WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedBy {
  return WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedByFromJSONTyped(
    json,
    false,
  )
}

export function WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedByFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedBy {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, "id") ? undefined : json["id"],
    firstName: !exists(json, "firstName") ? undefined : json["firstName"],
    lastName: !exists(json, "lastName") ? undefined : json["lastName"],
  }
}

export function WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedByToJSON(
  value?: WorkspaceMeetingTemplateGet200ResponseTemplatesInnerCreatedBy | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    firstName: value.firstName,
    lastName: value.lastName,
  }
}
