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
import type { UpdateOnboardingDataRequestDataHiringProcessStagesInner } from "./UpdateOnboardingDataRequestDataHiringProcessStagesInner"
import {
  UpdateOnboardingDataRequestDataHiringProcessStagesInnerFromJSON,
  UpdateOnboardingDataRequestDataHiringProcessStagesInnerFromJSONTyped,
  UpdateOnboardingDataRequestDataHiringProcessStagesInnerToJSON,
} from "./UpdateOnboardingDataRequestDataHiringProcessStagesInner"

/**
 *
 * @export
 * @interface UpdateOnboardingDataRequestDataHiringProcess
 */
export interface UpdateOnboardingDataRequestDataHiringProcess {
  /**
   *
   * @type {Array<UpdateOnboardingDataRequestDataHiringProcessStagesInner>}
   * @memberof UpdateOnboardingDataRequestDataHiringProcess
   */
  stages?: Array<UpdateOnboardingDataRequestDataHiringProcessStagesInner>
  /**
   *
   * @type {string}
   * @memberof UpdateOnboardingDataRequestDataHiringProcess
   */
  description?: string
}

/**
 * Check if a given object implements the UpdateOnboardingDataRequestDataHiringProcess interface.
 */
export function instanceOfUpdateOnboardingDataRequestDataHiringProcess(
  value: object,
): boolean {
  let isInstance = true

  return isInstance
}

export function UpdateOnboardingDataRequestDataHiringProcessFromJSON(
  json: any,
): UpdateOnboardingDataRequestDataHiringProcess {
  return UpdateOnboardingDataRequestDataHiringProcessFromJSONTyped(json, false)
}

export function UpdateOnboardingDataRequestDataHiringProcessFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): UpdateOnboardingDataRequestDataHiringProcess {
  if (json === undefined || json === null) {
    return json
  }
  return {
    stages: !exists(json, "stages")
      ? undefined
      : (json["stages"] as Array<any>).map(
          UpdateOnboardingDataRequestDataHiringProcessStagesInnerFromJSON,
        ),
    description: !exists(json, "description") ? undefined : json["description"],
  }
}

export function UpdateOnboardingDataRequestDataHiringProcessToJSON(
  value?: UpdateOnboardingDataRequestDataHiringProcess | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    stages:
      value.stages === undefined
        ? undefined
        : (value.stages as Array<any>).map(
            UpdateOnboardingDataRequestDataHiringProcessStagesInnerToJSON,
          ),
    description: value.description,
  }
}
