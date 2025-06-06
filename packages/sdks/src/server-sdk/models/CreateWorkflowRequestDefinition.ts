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
 * @interface CreateWorkflowRequestDefinition
 */
export interface CreateWorkflowRequestDefinition {
  /**
   *
   * @type {object}
   * @memberof CreateWorkflowRequestDefinition
   */
  graph: object
  /**
   *
   * @type {object}
   * @memberof CreateWorkflowRequestDefinition
   */
  config: object
  /**
   *
   * @type {number}
   * @memberof CreateWorkflowRequestDefinition
   */
  version: number
}

/**
 * Check if a given object implements the CreateWorkflowRequestDefinition interface.
 */
export function instanceOfCreateWorkflowRequestDefinition(
  value: object,
): boolean {
  let isInstance = true
  isInstance = isInstance && "graph" in value
  isInstance = isInstance && "config" in value
  isInstance = isInstance && "version" in value

  return isInstance
}

export function CreateWorkflowRequestDefinitionFromJSON(
  json: any,
): CreateWorkflowRequestDefinition {
  return CreateWorkflowRequestDefinitionFromJSONTyped(json, false)
}

export function CreateWorkflowRequestDefinitionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CreateWorkflowRequestDefinition {
  if (json === undefined || json === null) {
    return json
  }
  return {
    graph: json["graph"],
    config: json["config"],
    version: json["version"],
  }
}

export function CreateWorkflowRequestDefinitionToJSON(
  value?: CreateWorkflowRequestDefinition | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    graph: value.graph,
    config: value.config,
    version: value.version,
  }
}
