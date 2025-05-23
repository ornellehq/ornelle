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


import * as runtime from '../runtime';
import type {
  CreateEmailTemplateRequest,
  Def0,
  GetEmailTemplates200ResponseInner,
  UpdateEmailTemplateRequest,
} from '../models';
import {
    CreateEmailTemplateRequestFromJSON,
    CreateEmailTemplateRequestToJSON,
    Def0FromJSON,
    Def0ToJSON,
    GetEmailTemplates200ResponseInnerFromJSON,
    GetEmailTemplates200ResponseInnerToJSON,
    UpdateEmailTemplateRequestFromJSON,
    UpdateEmailTemplateRequestToJSON,
} from '../models';

export interface CreateEmailTemplateOperationRequest {
    createEmailTemplateRequest: CreateEmailTemplateRequest;
}

export interface DeleteEmailTemplateRequest {
    id: string;
}

export interface GetEmailTemplateRequest {
    id: string;
}

export interface GetEmailTemplatesRequest {
    emailType?: GetEmailTemplatesEmailTypeEnum;
}

export interface UpdateEmailTemplateOperationRequest {
    id: string;
    updateEmailTemplateRequest?: UpdateEmailTemplateRequest;
}

/**
 * EmailTemplateApi - interface
 * 
 * @export
 * @interface EmailTemplateApiInterface
 */
export interface EmailTemplateApiInterface {
    /**
     * Creates an email template in the current workspace
     * @param {CreateEmailTemplateRequest} createEmailTemplateRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EmailTemplateApiInterface
     */
    createEmailTemplateRaw(requestParameters: CreateEmailTemplateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetEmailTemplates200ResponseInner>>;

    /**
     * Creates an email template in the current workspace
     */
    createEmailTemplate(requestParameters: CreateEmailTemplateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetEmailTemplates200ResponseInner>;

    /**
     * Deletes an email template from the current workspace
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EmailTemplateApiInterface
     */
    deleteEmailTemplateRaw(requestParameters: DeleteEmailTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Deletes an email template from the current workspace
     */
    deleteEmailTemplate(requestParameters: DeleteEmailTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Return an email template by ID
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EmailTemplateApiInterface
     */
    getEmailTemplateRaw(requestParameters: GetEmailTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetEmailTemplates200ResponseInner>>;

    /**
     * Return an email template by ID
     */
    getEmailTemplate(requestParameters: GetEmailTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetEmailTemplates200ResponseInner>;

    /**
     * Gets email templates in the current workspace
     * @param {'Application'} [emailType] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EmailTemplateApiInterface
     */
    getEmailTemplatesRaw(requestParameters: GetEmailTemplatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<GetEmailTemplates200ResponseInner>>>;

    /**
     * Gets email templates in the current workspace
     */
    getEmailTemplates(requestParameters: GetEmailTemplatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<GetEmailTemplates200ResponseInner>>;

    /**
     * Updates an email template in the current workspace
     * @param {string} id 
     * @param {UpdateEmailTemplateRequest} [updateEmailTemplateRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EmailTemplateApiInterface
     */
    updateEmailTemplateRaw(requestParameters: UpdateEmailTemplateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetEmailTemplates200ResponseInner>>;

    /**
     * Updates an email template in the current workspace
     */
    updateEmailTemplate(requestParameters: UpdateEmailTemplateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetEmailTemplates200ResponseInner>;

}

/**
 * 
 */
export class EmailTemplateApi extends runtime.BaseAPI implements EmailTemplateApiInterface {

    /**
     * Creates an email template in the current workspace
     */
    async createEmailTemplateRaw(requestParameters: CreateEmailTemplateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetEmailTemplates200ResponseInner>> {
        if (requestParameters.createEmailTemplateRequest === null || requestParameters.createEmailTemplateRequest === undefined) {
            throw new runtime.RequiredError('createEmailTemplateRequest','Required parameter requestParameters.createEmailTemplateRequest was null or undefined when calling createEmailTemplate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/workspace/email-templates/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateEmailTemplateRequestToJSON(requestParameters.createEmailTemplateRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetEmailTemplates200ResponseInnerFromJSON(jsonValue));
    }

    /**
     * Creates an email template in the current workspace
     */
    async createEmailTemplate(requestParameters: CreateEmailTemplateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetEmailTemplates200ResponseInner> {
        const response = await this.createEmailTemplateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Deletes an email template from the current workspace
     */
    async deleteEmailTemplateRaw(requestParameters: DeleteEmailTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling deleteEmailTemplate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/workspace/email-templates/{id}/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes an email template from the current workspace
     */
    async deleteEmailTemplate(requestParameters: DeleteEmailTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteEmailTemplateRaw(requestParameters, initOverrides);
    }

    /**
     * Return an email template by ID
     */
    async getEmailTemplateRaw(requestParameters: GetEmailTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetEmailTemplates200ResponseInner>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getEmailTemplate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/workspace/email-templates/{id}/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetEmailTemplates200ResponseInnerFromJSON(jsonValue));
    }

    /**
     * Return an email template by ID
     */
    async getEmailTemplate(requestParameters: GetEmailTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetEmailTemplates200ResponseInner> {
        const response = await this.getEmailTemplateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets email templates in the current workspace
     */
    async getEmailTemplatesRaw(requestParameters: GetEmailTemplatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<GetEmailTemplates200ResponseInner>>> {
        const queryParameters: any = {};

        if (requestParameters.emailType !== undefined) {
            queryParameters['emailType'] = requestParameters.emailType;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/workspace/email-templates/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GetEmailTemplates200ResponseInnerFromJSON));
    }

    /**
     * Gets email templates in the current workspace
     */
    async getEmailTemplates(requestParameters: GetEmailTemplatesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<GetEmailTemplates200ResponseInner>> {
        const response = await this.getEmailTemplatesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Updates an email template in the current workspace
     */
    async updateEmailTemplateRaw(requestParameters: UpdateEmailTemplateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetEmailTemplates200ResponseInner>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling updateEmailTemplate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/workspace/email-templates/{id}/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateEmailTemplateRequestToJSON(requestParameters.updateEmailTemplateRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetEmailTemplates200ResponseInnerFromJSON(jsonValue));
    }

    /**
     * Updates an email template in the current workspace
     */
    async updateEmailTemplate(requestParameters: UpdateEmailTemplateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetEmailTemplates200ResponseInner> {
        const response = await this.updateEmailTemplateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
  * @export
  * @enum {string}
  */
export enum GetEmailTemplatesEmailTypeEnum {
    Application = 'Application'
}
