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
import type { CreateAnApplication400ResponseError } from "./CreateAnApplication400ResponseError"
import {
  CreateAnApplication400ResponseErrorFromJSON,
  CreateAnApplication400ResponseErrorFromJSONTyped,
  CreateAnApplication400ResponseErrorToJSON,
} from "./CreateAnApplication400ResponseError"

/**
 *
 * @export
 * @interface CreateAnApplication400Response
 */
export interface CreateAnApplication400Response {
  /**
   *
   * @type {CreateAnApplication400ResponseError}
   * @memberof CreateAnApplication400Response
   */
  error?: CreateAnApplication400ResponseError
}

/**
 * Check if a given object implements the CreateAnApplication400Response interface.
 */
export function instanceOfCreateAnApplication400Response(
  value: object,
): boolean {
  let isInstance = true

  return isInstance
}

export function CreateAnApplication400ResponseFromJSON(
  json: any,
): CreateAnApplication400Response {
  return CreateAnApplication400ResponseFromJSONTyped(json, false)
}

export function CreateAnApplication400ResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CreateAnApplication400Response {
  if (json === undefined || json === null) {
    return json
  }
  return {
    error: !exists(json, "error")
      ? undefined
      : CreateAnApplication400ResponseErrorFromJSON(json["error"]),
  }
}

export function CreateAnApplication400ResponseToJSON(
  value?: CreateAnApplication400Response | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    error: CreateAnApplication400ResponseErrorToJSON(value.error),
  }
}
