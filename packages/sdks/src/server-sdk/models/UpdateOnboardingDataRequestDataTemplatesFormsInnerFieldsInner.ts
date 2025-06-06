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
 * @interface UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner
 */
export interface UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner {
  /**
   *
   * @type {string}
   * @memberof UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner
   */
  type?: string
  /**
   *
   * @type {boolean}
   * @memberof UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner
   */
  required?: boolean
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner
   */
  options?: Array<string>
  /**
   *
   * @type {string}
   * @memberof UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner
   */
  placeholder?: string
}

/**
 * Check if a given object implements the UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner interface.
 */
export function instanceOfUpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner(
  value: object,
): boolean {
  let isInstance = true

  return isInstance
}

export function UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInnerFromJSON(
  json: any,
): UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner {
  return UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInnerFromJSONTyped(
    json,
    false,
  )
}

export function UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner {
  if (json === undefined || json === null) {
    return json
  }
  return {
    name: !exists(json, "name") ? undefined : json["name"],
    type: !exists(json, "type") ? undefined : json["type"],
    required: !exists(json, "required") ? undefined : json["required"],
    options: !exists(json, "options") ? undefined : json["options"],
    placeholder: !exists(json, "placeholder") ? undefined : json["placeholder"],
  }
}

export function UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInnerToJSON(
  value?: UpdateOnboardingDataRequestDataTemplatesFormsInnerFieldsInner | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    name: value.name,
    type: value.type,
    required: value.required,
    options: value.options,
    placeholder: value.placeholder,
  }
}
