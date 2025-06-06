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
 * @interface GetMeetings200Response
 */
export interface GetMeetings200Response {
  /**
   *
   * @type {Array<GetMeetings200ResponseMeetingsInner>}
   * @memberof GetMeetings200Response
   */
  meetings?: Array<GetMeetings200ResponseMeetingsInner>
}

/**
 * Check if a given object implements the GetMeetings200Response interface.
 */
export function instanceOfGetMeetings200Response(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function GetMeetings200ResponseFromJSON(
  json: any,
): GetMeetings200Response {
  return GetMeetings200ResponseFromJSONTyped(json, false)
}

export function GetMeetings200ResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetMeetings200Response {
  if (json === undefined || json === null) {
    return json
  }
  return {
    meetings: !exists(json, "meetings")
      ? undefined
      : (json["meetings"] as Array<any>).map(
          GetMeetings200ResponseMeetingsInnerFromJSON,
        ),
  }
}

export function GetMeetings200ResponseToJSON(
  value?: GetMeetings200Response | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    meetings:
      value.meetings === undefined
        ? undefined
        : (value.meetings as Array<any>).map(
            GetMeetings200ResponseMeetingsInnerToJSON,
          ),
  }
}
