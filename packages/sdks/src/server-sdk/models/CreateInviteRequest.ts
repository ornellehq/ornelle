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
 * @interface CreateInviteRequest
 */
export interface CreateInviteRequest {
  /**
   *
   * @type {string}
   * @memberof CreateInviteRequest
   */
  inviteeFirstName: string
  /**
   *
   * @type {string}
   * @memberof CreateInviteRequest
   */
  inviteeLastName: string
  /**
   *
   * @type {string}
   * @memberof CreateInviteRequest
   */
  inviteeEmail: string
  /**
   *
   * @type {string}
   * @memberof CreateInviteRequest
   */
  permissionId: string
  /**
   *
   * @type {boolean}
   * @memberof CreateInviteRequest
   */
  notifySender?: boolean
}

/**
 * Check if a given object implements the CreateInviteRequest interface.
 */
export function instanceOfCreateInviteRequest(value: object): boolean {
  let isInstance = true
  isInstance = isInstance && "inviteeFirstName" in value
  isInstance = isInstance && "inviteeLastName" in value
  isInstance = isInstance && "inviteeEmail" in value
  isInstance = isInstance && "permissionId" in value

  return isInstance
}

export function CreateInviteRequestFromJSON(json: any): CreateInviteRequest {
  return CreateInviteRequestFromJSONTyped(json, false)
}

export function CreateInviteRequestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CreateInviteRequest {
  if (json === undefined || json === null) {
    return json
  }
  return {
    inviteeFirstName: json["inviteeFirstName"],
    inviteeLastName: json["inviteeLastName"],
    inviteeEmail: json["inviteeEmail"],
    permissionId: json["permissionId"],
    notifySender: !exists(json, "notifySender")
      ? undefined
      : json["notifySender"],
  }
}

export function CreateInviteRequestToJSON(
  value?: CreateInviteRequest | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    inviteeFirstName: value.inviteeFirstName,
    inviteeLastName: value.inviteeLastName,
    inviteeEmail: value.inviteeEmail,
    permissionId: value.permissionId,
    notifySender: value.notifySender,
  }
}
