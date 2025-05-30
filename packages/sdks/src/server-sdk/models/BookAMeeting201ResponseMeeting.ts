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
 * @interface BookAMeeting201ResponseMeeting
 */
export interface BookAMeeting201ResponseMeeting {
  /**
   *
   * @type {string}
   * @memberof BookAMeeting201ResponseMeeting
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof BookAMeeting201ResponseMeeting
   */
  title?: string
  /**
   *
   * @type {Date}
   * @memberof BookAMeeting201ResponseMeeting
   */
  startTime?: Date
  /**
   *
   * @type {Date}
   * @memberof BookAMeeting201ResponseMeeting
   */
  endTime?: Date
  /**
   *
   * @type {string}
   * @memberof BookAMeeting201ResponseMeeting
   */
  status?: string
}

/**
 * Check if a given object implements the BookAMeeting201ResponseMeeting interface.
 */
export function instanceOfBookAMeeting201ResponseMeeting(
  value: object,
): boolean {
  let isInstance = true

  return isInstance
}

export function BookAMeeting201ResponseMeetingFromJSON(
  json: any,
): BookAMeeting201ResponseMeeting {
  return BookAMeeting201ResponseMeetingFromJSONTyped(json, false)
}

export function BookAMeeting201ResponseMeetingFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): BookAMeeting201ResponseMeeting {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, "id") ? undefined : json["id"],
    title: !exists(json, "title") ? undefined : json["title"],
    startTime: !exists(json, "startTime")
      ? undefined
      : new Date(json["startTime"]),
    endTime: !exists(json, "endTime") ? undefined : new Date(json["endTime"]),
    status: !exists(json, "status") ? undefined : json["status"],
  }
}

export function BookAMeeting201ResponseMeetingToJSON(
  value?: BookAMeeting201ResponseMeeting | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    title: value.title,
    startTime:
      value.startTime === undefined ? undefined : value.startTime.toISOString(),
    endTime:
      value.endTime === undefined ? undefined : value.endTime.toISOString(),
    status: value.status,
  }
}
