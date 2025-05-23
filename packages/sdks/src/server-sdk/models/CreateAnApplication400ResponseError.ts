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
 * @interface CreateAnApplication400ResponseError
 */
export interface CreateAnApplication400ResponseError {
  /**
   *
   * @type {string}
   * @memberof CreateAnApplication400ResponseError
   */
  code?: string
  /**
   *
   * @type {string}
   * @memberof CreateAnApplication400ResponseError
   */
  message?: string
  /**
   *
   * @type {string}
   * @memberof CreateAnApplication400ResponseError
   */
  details?: string
}

/**
 * Check if a given object implements the CreateAnApplication400ResponseError interface.
 */
export function instanceOfCreateAnApplication400ResponseError(
  value: object,
): boolean {
  let isInstance = true

  return isInstance
}

export function CreateAnApplication400ResponseErrorFromJSON(
  json: any,
): CreateAnApplication400ResponseError {
  return CreateAnApplication400ResponseErrorFromJSONTyped(json, false)
}

export function CreateAnApplication400ResponseErrorFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CreateAnApplication400ResponseError {
  if (json === undefined || json === null) {
    return json
  }
  return {
    code: !exists(json, "code") ? undefined : json["code"],
    message: !exists(json, "message") ? undefined : json["message"],
    details: !exists(json, "details") ? undefined : json["details"],
  }
}

export function CreateAnApplication400ResponseErrorToJSON(
  value?: CreateAnApplication400ResponseError | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    code: value.code,
    message: value.message,
    details: value.details,
  }
}
