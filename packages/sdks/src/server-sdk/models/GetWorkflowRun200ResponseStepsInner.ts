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
 * @interface GetWorkflowRun200ResponseStepsInner
 */
export interface GetWorkflowRun200ResponseStepsInner {
  [key: string]: any | any
  /**
   *
   * @type {string}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  id: string
  /**
   *
   * @type {Date}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  updatedAt: Date
  /**
   *
   * @type {Date}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  createdAt: Date
  /**
   *
   * @type {Date}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  startedAt: Date
  /**
   *
   * @type {any}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  completedAt?: any | null
  /**
   *
   * @type {string}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  stepCode: string
  /**
   *
   * @type {string}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  status?: GetWorkflowRun200ResponseStepsInnerStatusEnum
  /**
   *
   * @type {string}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  nodeId: string
  /**
   *
   * @type {string}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  workflowRunId: string
  /**
   *
   * @type {string}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  workspaceId: string
  /**
   *
   * @type {any}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  outputData?: any | null
  /**
   *
   * @type {any}
   * @memberof GetWorkflowRun200ResponseStepsInner
   */
  inputData?: any | null
}

/**
 * @export
 * @enum {string}
 */
export enum GetWorkflowRun200ResponseStepsInnerStatusEnum {
  NotStarted = "NotStarted",
  Pending = "Pending",
  Running = "Running",
  Completed = "Completed",
  Failed = "Failed",
  Skipped = "Skipped",
  ManuallyCompleted = "ManuallyCompleted",
}

/**
 * Check if a given object implements the GetWorkflowRun200ResponseStepsInner interface.
 */
export function instanceOfGetWorkflowRun200ResponseStepsInner(
  value: object,
): boolean {
  let isInstance = true
  isInstance = isInstance && "id" in value
  isInstance = isInstance && "updatedAt" in value
  isInstance = isInstance && "createdAt" in value
  isInstance = isInstance && "startedAt" in value
  isInstance = isInstance && "stepCode" in value
  isInstance = isInstance && "nodeId" in value
  isInstance = isInstance && "workflowRunId" in value
  isInstance = isInstance && "workspaceId" in value

  return isInstance
}

export function GetWorkflowRun200ResponseStepsInnerFromJSON(
  json: any,
): GetWorkflowRun200ResponseStepsInner {
  return GetWorkflowRun200ResponseStepsInnerFromJSONTyped(json, false)
}

export function GetWorkflowRun200ResponseStepsInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetWorkflowRun200ResponseStepsInner {
  if (json === undefined || json === null) {
    return json
  }
  return {
    ...json,
    id: json["id"],
    updatedAt: new Date(json["updatedAt"]),
    createdAt: new Date(json["createdAt"]),
    startedAt: new Date(json["startedAt"]),
    completedAt: !exists(json, "completedAt") ? undefined : json["completedAt"],
    stepCode: json["stepCode"],
    status: !exists(json, "status") ? undefined : json["status"],
    nodeId: json["nodeId"],
    workflowRunId: json["workflowRunId"],
    workspaceId: json["workspaceId"],
    outputData: !exists(json, "outputData") ? undefined : json["outputData"],
    inputData: !exists(json, "inputData") ? undefined : json["inputData"],
  }
}

export function GetWorkflowRun200ResponseStepsInnerToJSON(
  value?: GetWorkflowRun200ResponseStepsInner | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    ...value,
    id: value.id,
    updatedAt: value.updatedAt.toISOString(),
    createdAt: value.createdAt.toISOString(),
    startedAt: value.startedAt.toISOString(),
    completedAt: value.completedAt,
    stepCode: value.stepCode,
    status: value.status,
    nodeId: value.nodeId,
    workflowRunId: value.workflowRunId,
    workspaceId: value.workspaceId,
    outputData: value.outputData,
    inputData: value.inputData,
  }
}
