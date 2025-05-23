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
 * @interface CreateReview200Response
 */
export interface CreateReview200Response {
  /**
   *
   * @type {string}
   * @memberof CreateReview200Response
   */
  id: string
  /**
   *
   * @type {Date}
   * @memberof CreateReview200Response
   */
  updatedAt: Date
  /**
   *
   * @type {Date}
   * @memberof CreateReview200Response
   */
  createdAt: Date
  /**
   *
   * @type {string}
   * @memberof CreateReview200Response
   */
  workspaceId: string
  /**
   *
   * @type {string}
   * @memberof CreateReview200Response
   */
  applicationId: string
  /**
   *
   * @type {string}
   * @memberof CreateReview200Response
   */
  authorId: string
  /**
   *
   * @type {any}
   * @memberof CreateReview200Response
   */
  responses: any | null
  /**
   *
   * @type {string}
   * @memberof CreateReview200Response
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof CreateReview200Response
   */
  status?: CreateReview200ResponseStatusEnum
  /**
   *
   * @type {string}
   * @memberof CreateReview200Response
   */
  source: CreateReview200ResponseSourceEnum
  /**
   *
   * @type {string}
   * @memberof CreateReview200Response
   */
  sourceId: string
  /**
   *
   * @type {any}
   * @memberof CreateReview200Response
   */
  formId?: any | null
}

/**
 * @export
 * @enum {string}
 */
export enum CreateReview200ResponseStatusEnum {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}
/**
 * @export
 * @enum {string}
 */
export enum CreateReview200ResponseSourceEnum {
  Profile = "Profile",
  Candidate = "Candidate",
}

/**
 * Check if a given object implements the CreateReview200Response interface.
 */
export function instanceOfCreateReview200Response(value: object): boolean {
  let isInstance = true
  isInstance = isInstance && "id" in value
  isInstance = isInstance && "updatedAt" in value
  isInstance = isInstance && "createdAt" in value
  isInstance = isInstance && "workspaceId" in value
  isInstance = isInstance && "applicationId" in value
  isInstance = isInstance && "authorId" in value
  isInstance = isInstance && "responses" in value
  isInstance = isInstance && "source" in value
  isInstance = isInstance && "sourceId" in value

  return isInstance
}

export function CreateReview200ResponseFromJSON(
  json: any,
): CreateReview200Response {
  return CreateReview200ResponseFromJSONTyped(json, false)
}

export function CreateReview200ResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CreateReview200Response {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: json["id"],
    updatedAt: new Date(json["updatedAt"]),
    createdAt: new Date(json["createdAt"]),
    workspaceId: json["workspaceId"],
    applicationId: json["applicationId"],
    authorId: json["authorId"],
    responses: json["responses"],
    description: !exists(json, "description") ? undefined : json["description"],
    status: !exists(json, "status") ? undefined : json["status"],
    source: json["source"],
    sourceId: json["sourceId"],
    formId: !exists(json, "formId") ? undefined : json["formId"],
  }
}

export function CreateReview200ResponseToJSON(
  value?: CreateReview200Response | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    updatedAt: value.updatedAt.toISOString(),
    createdAt: value.createdAt.toISOString(),
    workspaceId: value.workspaceId,
    applicationId: value.applicationId,
    authorId: value.authorId,
    responses: value.responses,
    description: value.description,
    status: value.status,
    source: value.source,
    sourceId: value.sourceId,
    formId: value.formId,
  }
}
