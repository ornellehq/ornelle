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
import type { GetMeetings200ResponseMeetingsInner } from "./GetMeetings200ResponseMeetingsInner"
import {
  GetMeetings200ResponseMeetingsInnerFromJSON,
  GetMeetings200ResponseMeetingsInnerFromJSONTyped,
  GetMeetings200ResponseMeetingsInnerToJSON,
} from "./GetMeetings200ResponseMeetingsInner"

/**
 *
 * @export
 * @interface CreateMeeting201Response
 */
export interface CreateMeeting201Response {
  /**
   *
   * @type {GetMeetings200ResponseMeetingsInner}
   * @memberof CreateMeeting201Response
   */
  meeting?: GetMeetings200ResponseMeetingsInner
}

/**
 * Check if a given object implements the CreateMeeting201Response interface.
 */
export function instanceOfCreateMeeting201Response(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function CreateMeeting201ResponseFromJSON(
  json: any,
): CreateMeeting201Response {
  return CreateMeeting201ResponseFromJSONTyped(json, false)
}

export function CreateMeeting201ResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CreateMeeting201Response {
  if (json === undefined || json === null) {
    return json
  }
  return {
    meeting: !exists(json, "meeting")
      ? undefined
      : GetMeetings200ResponseMeetingsInnerFromJSON(json["meeting"]),
  }
}

export function CreateMeeting201ResponseToJSON(
  value?: CreateMeeting201Response | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    meeting: GetMeetings200ResponseMeetingsInnerToJSON(value.meeting),
  }
}
