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
 * @interface GetCandidatesSortsParameterInner
 */
export interface GetCandidatesSortsParameterInner {
  /**
   *
   * @type {string}
   * @memberof GetCandidatesSortsParameterInner
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof GetCandidatesSortsParameterInner
   */
  order: GetCandidatesSortsParameterInnerOrderEnum
}

/**
 * @export
 * @enum {string}
 */
export enum GetCandidatesSortsParameterInnerOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/**
 * Check if a given object implements the GetCandidatesSortsParameterInner interface.
 */
export function instanceOfGetCandidatesSortsParameterInner(
  value: object,
): boolean {
  let isInstance = true
  isInstance = isInstance && "id" in value
  isInstance = isInstance && "order" in value

  return isInstance
}

export function GetCandidatesSortsParameterInnerFromJSON(
  json: any,
): GetCandidatesSortsParameterInner {
  return GetCandidatesSortsParameterInnerFromJSONTyped(json, false)
}

export function GetCandidatesSortsParameterInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetCandidatesSortsParameterInner {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: json["id"],
    order: json["order"],
  }
}

export function GetCandidatesSortsParameterInnerToJSON(
  value?: GetCandidatesSortsParameterInner | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    order: value.order,
  }
}
