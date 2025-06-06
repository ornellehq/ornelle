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
import type { WorkspaceMeetingTemplateIdDelete200Response1Template } from "./WorkspaceMeetingTemplateIdDelete200Response1Template"
import {
  WorkspaceMeetingTemplateIdDelete200Response1TemplateFromJSON,
  WorkspaceMeetingTemplateIdDelete200Response1TemplateFromJSONTyped,
  WorkspaceMeetingTemplateIdDelete200Response1TemplateToJSON,
} from "./WorkspaceMeetingTemplateIdDelete200Response1Template"

/**
 *
 * @export
 * @interface WorkspaceMeetingTemplateIdDelete200Response1
 */
export interface WorkspaceMeetingTemplateIdDelete200Response1 {
  /**
   *
   * @type {WorkspaceMeetingTemplateIdDelete200Response1Template}
   * @memberof WorkspaceMeetingTemplateIdDelete200Response1
   */
  template?: WorkspaceMeetingTemplateIdDelete200Response1Template
}

/**
 * Check if a given object implements the WorkspaceMeetingTemplateIdDelete200Response1 interface.
 */
export function instanceOfWorkspaceMeetingTemplateIdDelete200Response1(
  value: object,
): boolean {
  let isInstance = true

  return isInstance
}

export function WorkspaceMeetingTemplateIdDelete200Response1FromJSON(
  json: any,
): WorkspaceMeetingTemplateIdDelete200Response1 {
  return WorkspaceMeetingTemplateIdDelete200Response1FromJSONTyped(json, false)
}

export function WorkspaceMeetingTemplateIdDelete200Response1FromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): WorkspaceMeetingTemplateIdDelete200Response1 {
  if (json === undefined || json === null) {
    return json
  }
  return {
    template: !exists(json, "template")
      ? undefined
      : WorkspaceMeetingTemplateIdDelete200Response1TemplateFromJSON(
          json["template"],
        ),
  }
}

export function WorkspaceMeetingTemplateIdDelete200Response1ToJSON(
  value?: WorkspaceMeetingTemplateIdDelete200Response1 | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    template: WorkspaceMeetingTemplateIdDelete200Response1TemplateToJSON(
      value.template,
    ),
  }
}
