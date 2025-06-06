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
import type { GetWorkflow200ResponseStagesInnerStepsInner } from "./GetWorkflow200ResponseStagesInnerStepsInner"
import {
  GetWorkflow200ResponseStagesInnerStepsInnerFromJSON,
  GetWorkflow200ResponseStagesInnerStepsInnerFromJSONTyped,
  GetWorkflow200ResponseStagesInnerStepsInnerToJSON,
} from "./GetWorkflow200ResponseStagesInnerStepsInner"

/**
 *
 * @export
 * @interface GetWorkflow200ResponseStagesInner
 */
export interface GetWorkflow200ResponseStagesInner {
  /**
   *
   * @type {string}
   * @memberof GetWorkflow200ResponseStagesInner
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof GetWorkflow200ResponseStagesInner
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof GetWorkflow200ResponseStagesInner
   */
  value?: string
  /**
   *
   * @type {Array<GetWorkflow200ResponseStagesInnerStepsInner>}
   * @memberof GetWorkflow200ResponseStagesInner
   */
  steps?: Array<GetWorkflow200ResponseStagesInnerStepsInner>
}

/**
 * Check if a given object implements the GetWorkflow200ResponseStagesInner interface.
 */
export function instanceOfGetWorkflow200ResponseStagesInner(
  value: object,
): boolean {
  let isInstance = true

  return isInstance
}

export function GetWorkflow200ResponseStagesInnerFromJSON(
  json: any,
): GetWorkflow200ResponseStagesInner {
  return GetWorkflow200ResponseStagesInnerFromJSONTyped(json, false)
}

export function GetWorkflow200ResponseStagesInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetWorkflow200ResponseStagesInner {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, "id") ? undefined : json["id"],
    name: !exists(json, "name") ? undefined : json["name"],
    value: !exists(json, "value") ? undefined : json["value"],
    steps: !exists(json, "steps")
      ? undefined
      : (json["steps"] as Array<any>).map(
          GetWorkflow200ResponseStagesInnerStepsInnerFromJSON,
        ),
  }
}

export function GetWorkflow200ResponseStagesInnerToJSON(
  value?: GetWorkflow200ResponseStagesInner | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    name: value.name,
    value: value.value,
    steps:
      value.steps === undefined
        ? undefined
        : (value.steps as Array<any>).map(
            GetWorkflow200ResponseStagesInnerStepsInnerToJSON,
          ),
  }
}
