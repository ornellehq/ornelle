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
 * @interface UpdateWorkflowRunStepRequestMeetingCompleted
 */
export interface UpdateWorkflowRunStepRequestMeetingCompleted {
  /**
   *
   * @type {string}
   * @memberof UpdateWorkflowRunStepRequestMeetingCompleted
   */
  status: UpdateWorkflowRunStepRequestMeetingCompletedStatusEnum
}

/**
 * @export
 * @enum {string}
 */
export enum UpdateWorkflowRunStepRequestMeetingCompletedStatusEnum {
  Completed = "completed",
  Cancelled = "cancelled",
  Rescheduled = "rescheduled",
}

/**
 * Check if a given object implements the UpdateWorkflowRunStepRequestMeetingCompleted interface.
 */
export function instanceOfUpdateWorkflowRunStepRequestMeetingCompleted(
  value: object,
): boolean {
  let isInstance = true
  isInstance = isInstance && "status" in value

  return isInstance
}

export function UpdateWorkflowRunStepRequestMeetingCompletedFromJSON(
  json: any,
): UpdateWorkflowRunStepRequestMeetingCompleted {
  return UpdateWorkflowRunStepRequestMeetingCompletedFromJSONTyped(json, false)
}

export function UpdateWorkflowRunStepRequestMeetingCompletedFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): UpdateWorkflowRunStepRequestMeetingCompleted {
  if (json === undefined || json === null) {
    return json
  }
  return {
    status: json["status"],
  }
}

export function UpdateWorkflowRunStepRequestMeetingCompletedToJSON(
  value?: UpdateWorkflowRunStepRequestMeetingCompleted | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    status: value.status,
  }
}
