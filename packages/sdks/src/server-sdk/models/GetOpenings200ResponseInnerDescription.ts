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
 * @interface GetOpenings200ResponseInnerDescription
 */
export interface GetOpenings200ResponseInnerDescription {
  /**
   *
   * @type {string}
   * @memberof GetOpenings200ResponseInnerDescription
   */
  html: string
  /**
   *
   * @type {object}
   * @memberof GetOpenings200ResponseInnerDescription
   */
  json: object
}

/**
 * Check if a given object implements the GetOpenings200ResponseInnerDescription interface.
 */
export function instanceOfGetOpenings200ResponseInnerDescription(
  value: object,
): boolean {
  let isInstance = true
  isInstance = isInstance && "html" in value
  isInstance = isInstance && "json" in value

  return isInstance
}

export function GetOpenings200ResponseInnerDescriptionFromJSON(
  json: any,
): GetOpenings200ResponseInnerDescription {
  return GetOpenings200ResponseInnerDescriptionFromJSONTyped(json, false)
}

export function GetOpenings200ResponseInnerDescriptionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetOpenings200ResponseInnerDescription {
  if (json === undefined || json === null) {
    return json
  }
  return {
    html: json["html"],
    json: json["json"],
  }
}

export function GetOpenings200ResponseInnerDescriptionToJSON(
  value?: GetOpenings200ResponseInnerDescription | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    html: value.html,
    json: value.json,
  }
}
