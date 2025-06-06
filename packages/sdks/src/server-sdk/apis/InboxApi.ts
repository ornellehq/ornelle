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

import type { GetInbox200ResponseInner } from "../models"
import {
  GetInbox200ResponseInnerFromJSON,
  GetInbox200ResponseInnerToJSON,
} from "../models"
import * as runtime from "../runtime"

/**
 * InboxApi - interface
 *
 * @export
 * @interface InboxApiInterface
 */
export interface InboxApiInterface {
  /**
   * Get inbox for the current profile
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InboxApiInterface
   */
  getInboxRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<Array<GetInbox200ResponseInner>>>

  /**
   * Get inbox for the current profile
   */
  getInbox(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<Array<GetInbox200ResponseInner>>
}

/**
 *
 */
export class InboxApi extends runtime.BaseAPI implements InboxApiInterface {
  /**
   * Get inbox for the current profile
   */
  async getInboxRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<Array<GetInbox200ResponseInner>>> {
    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    if (this.configuration && this.configuration.apiKey) {
      headerParameters["Authorization"] =
        this.configuration.apiKey("Authorization") // permissions authentication
    }

    const response = await this.request(
      {
        path: `/workspace/inbox/`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      jsonValue.map(GetInbox200ResponseInnerFromJSON),
    )
  }

  /**
   * Get inbox for the current profile
   */
  async getInbox(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<Array<GetInbox200ResponseInner>> {
    const response = await this.getInboxRaw(initOverrides)
    return await response.value()
  }
}
