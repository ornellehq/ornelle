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
 * @interface GetProfiles200ResponseInnerUser
 */
export interface GetProfiles200ResponseInnerUser {
  /**
   *
   * @type {string}
   * @memberof GetProfiles200ResponseInnerUser
   */
  email: string
}

/**
 * Check if a given object implements the GetProfiles200ResponseInnerUser interface.
 */
export function instanceOfGetProfiles200ResponseInnerUser(
  value: object,
): boolean {
  let isInstance = true
  isInstance = isInstance && "email" in value

  return isInstance
}

export function GetProfiles200ResponseInnerUserFromJSON(
  json: any,
): GetProfiles200ResponseInnerUser {
  return GetProfiles200ResponseInnerUserFromJSONTyped(json, false)
}

export function GetProfiles200ResponseInnerUserFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetProfiles200ResponseInnerUser {
  if (json === undefined || json === null) {
    return json
  }
  return {
    email: json["email"],
  }
}

export function GetProfiles200ResponseInnerUserToJSON(
  value?: GetProfiles200ResponseInnerUser | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    email: value.email,
  }
}
