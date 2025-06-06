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
 * @interface CreatePermissionRequest
 */
export interface CreatePermissionRequest {
  /**
   * Name of the permission
   * @type {string}
   * @memberof CreatePermissionRequest
   */
  name: string
  /**
   * List of permission strings
   * @type {Array<string>}
   * @memberof CreatePermissionRequest
   */
  permissions: Array<string>
  /**
   * Filter configuration for the permission (JSON)
   * @type {{ [key: string]: any; }}
   * @memberof CreatePermissionRequest
   */
  filter?: { [key: string]: any }
}

/**
 * Check if a given object implements the CreatePermissionRequest interface.
 */
export function instanceOfCreatePermissionRequest(value: object): boolean {
  let isInstance = true
  isInstance = isInstance && "name" in value
  isInstance = isInstance && "permissions" in value

  return isInstance
}

export function CreatePermissionRequestFromJSON(
  json: any,
): CreatePermissionRequest {
  return CreatePermissionRequestFromJSONTyped(json, false)
}

export function CreatePermissionRequestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CreatePermissionRequest {
  if (json === undefined || json === null) {
    return json
  }
  return {
    name: json["name"],
    permissions: json["permissions"],
    filter: !exists(json, "filter") ? undefined : json["filter"],
  }
}

export function CreatePermissionRequestToJSON(
  value?: CreatePermissionRequest | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    name: value.name,
    permissions: value.permissions,
    filter: value.filter,
  }
}
