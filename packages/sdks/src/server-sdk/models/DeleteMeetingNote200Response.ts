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
 * @interface DeleteMeetingNote200Response
 */
export interface DeleteMeetingNote200Response {
  /**
   *
   * @type {boolean}
   * @memberof DeleteMeetingNote200Response
   */
  success?: boolean
  /**
   *
   * @type {string}
   * @memberof DeleteMeetingNote200Response
   */
  deletedId?: string
}

/**
 * Check if a given object implements the DeleteMeetingNote200Response interface.
 */
export function instanceOfDeleteMeetingNote200Response(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function DeleteMeetingNote200ResponseFromJSON(
  json: any,
): DeleteMeetingNote200Response {
  return DeleteMeetingNote200ResponseFromJSONTyped(json, false)
}

export function DeleteMeetingNote200ResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): DeleteMeetingNote200Response {
  if (json === undefined || json === null) {
    return json
  }
  return {
    success: !exists(json, "success") ? undefined : json["success"],
    deletedId: !exists(json, "deletedId") ? undefined : json["deletedId"],
  }
}

export function DeleteMeetingNote200ResponseToJSON(
  value?: DeleteMeetingNote200Response | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    success: value.success,
    deletedId: value.deletedId,
  }
}
