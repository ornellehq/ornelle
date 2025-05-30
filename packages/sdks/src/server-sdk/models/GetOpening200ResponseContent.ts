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
 * @interface GetOpening200ResponseContent
 */
export interface GetOpening200ResponseContent {
  /**
   *
   * @type {string}
   * @memberof GetOpening200ResponseContent
   */
  html: string
  /**
   *
   * @type {any}
   * @memberof GetOpening200ResponseContent
   */
  json: any | null
}

/**
 * Check if a given object implements the GetOpening200ResponseContent interface.
 */
export function instanceOfGetOpening200ResponseContent(value: object): boolean {
  let isInstance = true
  isInstance = isInstance && "html" in value
  isInstance = isInstance && "json" in value

  return isInstance
}

export function GetOpening200ResponseContentFromJSON(
  json: any,
): GetOpening200ResponseContent {
  return GetOpening200ResponseContentFromJSONTyped(json, false)
}

export function GetOpening200ResponseContentFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetOpening200ResponseContent {
  if (json === undefined || json === null) {
    return json
  }
  return {
    html: json["html"],
    json: json["json"],
  }
}

export function GetOpening200ResponseContentToJSON(
  value?: GetOpening200ResponseContent | null,
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
