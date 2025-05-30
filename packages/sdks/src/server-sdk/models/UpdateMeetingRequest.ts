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
 * @interface UpdateMeetingRequest
 */
export interface UpdateMeetingRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateMeetingRequest
   */
  title?: string
  /**
   *
   * @type {string}
   * @memberof UpdateMeetingRequest
   */
  description?: string | null
  /**
   *
   * @type {number}
   * @memberof UpdateMeetingRequest
   */
  duration?: number
  /**
   *
   * @type {Date}
   * @memberof UpdateMeetingRequest
   */
  startTime?: Date
  /**
   *
   * @type {string}
   * @memberof UpdateMeetingRequest
   */
  location?: string | null
  /**
   *
   * @type {string}
   * @memberof UpdateMeetingRequest
   */
  status?: UpdateMeetingRequestStatusEnum
}

/**
 * @export
 * @enum {string}
 */
export enum UpdateMeetingRequestStatusEnum {
  Scheduled = "Scheduled",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

/**
 * Check if a given object implements the UpdateMeetingRequest interface.
 */
export function instanceOfUpdateMeetingRequest(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function UpdateMeetingRequestFromJSON(json: any): UpdateMeetingRequest {
  return UpdateMeetingRequestFromJSONTyped(json, false)
}

export function UpdateMeetingRequestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): UpdateMeetingRequest {
  if (json === undefined || json === null) {
    return json
  }
  return {
    title: !exists(json, "title") ? undefined : json["title"],
    description: !exists(json, "description") ? undefined : json["description"],
    duration: !exists(json, "duration") ? undefined : json["duration"],
    startTime: !exists(json, "startTime")
      ? undefined
      : new Date(json["startTime"]),
    location: !exists(json, "location") ? undefined : json["location"],
    status: !exists(json, "status") ? undefined : json["status"],
  }
}

export function UpdateMeetingRequestToJSON(
  value?: UpdateMeetingRequest | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    title: value.title,
    description: value.description,
    duration: value.duration,
    startTime:
      value.startTime === undefined ? undefined : value.startTime.toISOString(),
    location: value.location,
    status: value.status,
  }
}
