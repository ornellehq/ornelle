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
import type { GetReviews200ResponseInnerApplication } from "./GetReviews200ResponseInnerApplication"
import {
  GetReviews200ResponseInnerApplicationFromJSON,
  GetReviews200ResponseInnerApplicationFromJSONTyped,
  GetReviews200ResponseInnerApplicationToJSON,
} from "./GetReviews200ResponseInnerApplication"
import type { UpdateProfile200Response } from "./UpdateProfile200Response"
import {
  UpdateProfile200ResponseFromJSON,
  UpdateProfile200ResponseFromJSONTyped,
  UpdateProfile200ResponseToJSON,
} from "./UpdateProfile200Response"

/**
 *
 * @export
 * @interface GetSteps200ResponseInnerReviewsInner
 */
export interface GetSteps200ResponseInnerReviewsInner {
  /**
   *
   * @type {string}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  id: string
  /**
   *
   * @type {Date}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  updatedAt: Date
  /**
   *
   * @type {Date}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  createdAt: Date
  /**
   *
   * @type {string}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  workspaceId: string
  /**
   *
   * @type {string}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  applicationId: string
  /**
   *
   * @type {string}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  authorId: string
  /**
   *
   * @type {any}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  responses: any | null
  /**
   *
   * @type {string}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  status?: GetSteps200ResponseInnerReviewsInnerStatusEnum
  /**
   *
   * @type {string}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  source: GetSteps200ResponseInnerReviewsInnerSourceEnum
  /**
   *
   * @type {string}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  sourceId: string
  /**
   *
   * @type {any}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  formId?: any | null
  /**
   *
   * @type {any}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  workflowId?: any | null
  /**
   *
   * @type {UpdateProfile200Response}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  author?: UpdateProfile200Response
  /**
   *
   * @type {GetReviews200ResponseInnerApplication}
   * @memberof GetSteps200ResponseInnerReviewsInner
   */
  application?: GetReviews200ResponseInnerApplication
}

/**
 * @export
 * @enum {string}
 */
export enum GetSteps200ResponseInnerReviewsInnerStatusEnum {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}
/**
 * @export
 * @enum {string}
 */
export enum GetSteps200ResponseInnerReviewsInnerSourceEnum {
  Workflow = "Workflow",
  Profile = "Profile",
  Candidate = "Candidate",
}

/**
 * Check if a given object implements the GetSteps200ResponseInnerReviewsInner interface.
 */
export function instanceOfGetSteps200ResponseInnerReviewsInner(
  value: object,
): boolean {
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

export function GetSteps200ResponseInnerReviewsInnerFromJSON(
  json: any,
): GetSteps200ResponseInnerReviewsInner {
  return GetSteps200ResponseInnerReviewsInnerFromJSONTyped(json, false)
}

export function GetSteps200ResponseInnerReviewsInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetSteps200ResponseInnerReviewsInner {
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
    workflowId: !exists(json, "workflowId") ? undefined : json["workflowId"],
    author: !exists(json, "author")
      ? undefined
      : UpdateProfile200ResponseFromJSON(json["author"]),
    application: !exists(json, "application")
      ? undefined
      : GetReviews200ResponseInnerApplicationFromJSON(json["application"]),
  }
}

export function GetSteps200ResponseInnerReviewsInnerToJSON(
  value?: GetSteps200ResponseInnerReviewsInner | null,
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
    workflowId: value.workflowId,
    author: UpdateProfile200ResponseToJSON(value.author),
    application: GetReviews200ResponseInnerApplicationToJSON(value.application),
  }
}
