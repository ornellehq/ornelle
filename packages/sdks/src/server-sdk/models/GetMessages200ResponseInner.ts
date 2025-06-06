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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface GetMessages200ResponseInner
 */
export interface GetMessages200ResponseInner {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof GetMessages200ResponseInner
     */
    id: string;
    /**
     * 
     * @type {Date}
     * @memberof GetMessages200ResponseInner
     */
    updatedAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof GetMessages200ResponseInner
     */
    createdAt: Date;
    /**
     * 
     * @type {any}
     * @memberof GetMessages200ResponseInner
     */
    deletedAt?: any | null;
    /**
     * 
     * @type {string}
     * @memberof GetMessages200ResponseInner
     */
    type: GetMessages200ResponseInnerTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof GetMessages200ResponseInner
     */
    status?: GetMessages200ResponseInnerStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof GetMessages200ResponseInner
     */
    content: string;
    /**
     * 
     * @type {any}
     * @memberof GetMessages200ResponseInner
     */
    applicationId?: any | null;
    /**
     * 
     * @type {any}
     * @memberof GetMessages200ResponseInner
     */
    fromCandidateId?: any | null;
    /**
     * 
     * @type {any}
     * @memberof GetMessages200ResponseInner
     */
    conversationId?: any | null;
    /**
     * 
     * @type {string}
     * @memberof GetMessages200ResponseInner
     */
    workspaceId: string;
    /**
     * 
     * @type {any}
     * @memberof GetMessages200ResponseInner
     */
    authorId?: any | null;
    /**
     * 
     * @type {any}
     * @memberof GetMessages200ResponseInner
     */
    parentId?: any | null;
    /**
     * 
     * @type {any}
     * @memberof GetMessages200ResponseInner
     */
    metadata: any | null;
    /**
     * 
     * @type {any}
     * @memberof GetMessages200ResponseInner
     */
    attachments?: any | null;
    /**
     * 
     * @type {any}
     * @memberof GetMessages200ResponseInner
     */
    subject?: any | null;
    /**
     * 
     * @type {any}
     * @memberof GetMessages200ResponseInner
     */
    fromEmail?: any | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof GetMessages200ResponseInner
     */
    toEmails: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof GetMessages200ResponseInner
     */
    ccEmails: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof GetMessages200ResponseInner
     */
    bccEmails: Array<string>;
}

/**
* @export
* @enum {string}
*/
export enum GetMessages200ResponseInnerTypeEnum {
    EmailOutbound = 'EMAIL_OUTBOUND',
    EmailInbound = 'EMAIL_INBOUND',
    InternalMessage = 'INTERNAL_MESSAGE',
    InternalResponse = 'INTERNAL_RESPONSE',
    Platform = 'PLATFORM'
}
/**
* @export
* @enum {string}
*/
export enum GetMessages200ResponseInnerStatusEnum {
    Draft = 'DRAFT',
    Sending = 'SENDING',
    Sent = 'SENT',
    Published = 'PUBLISHED',
    Delivered = 'DELIVERED',
    Failed = 'FAILED',
    Bounced = 'BOUNCED',
    Archived = 'ARCHIVED'
}


/**
 * Check if a given object implements the GetMessages200ResponseInner interface.
 */
export function instanceOfGetMessages200ResponseInner(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "updatedAt" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "content" in value;
    isInstance = isInstance && "workspaceId" in value;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "toEmails" in value;
    isInstance = isInstance && "ccEmails" in value;
    isInstance = isInstance && "bccEmails" in value;

    return isInstance;
}

export function GetMessages200ResponseInnerFromJSON(json: any): GetMessages200ResponseInner {
    return GetMessages200ResponseInnerFromJSONTyped(json, false);
}

export function GetMessages200ResponseInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetMessages200ResponseInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
            ...json,
        'id': json['id'],
        'updatedAt': (new Date(json['updatedAt'])),
        'createdAt': (new Date(json['createdAt'])),
        'deletedAt': !exists(json, 'deletedAt') ? undefined : json['deletedAt'],
        'type': json['type'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'content': json['content'],
        'applicationId': !exists(json, 'applicationId') ? undefined : json['applicationId'],
        'fromCandidateId': !exists(json, 'fromCandidateId') ? undefined : json['fromCandidateId'],
        'conversationId': !exists(json, 'conversationId') ? undefined : json['conversationId'],
        'workspaceId': json['workspaceId'],
        'authorId': !exists(json, 'authorId') ? undefined : json['authorId'],
        'parentId': !exists(json, 'parentId') ? undefined : json['parentId'],
        'metadata': json['metadata'],
        'attachments': !exists(json, 'attachments') ? undefined : json['attachments'],
        'subject': !exists(json, 'subject') ? undefined : json['subject'],
        'fromEmail': !exists(json, 'fromEmail') ? undefined : json['fromEmail'],
        'toEmails': json['toEmails'],
        'ccEmails': json['ccEmails'],
        'bccEmails': json['bccEmails'],
    };
}

export function GetMessages200ResponseInnerToJSON(value?: GetMessages200ResponseInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
            ...value,
        'id': value.id,
        'updatedAt': (value.updatedAt.toISOString()),
        'createdAt': (value.createdAt.toISOString()),
        'deletedAt': value.deletedAt,
        'type': value.type,
        'status': value.status,
        'content': value.content,
        'applicationId': value.applicationId,
        'fromCandidateId': value.fromCandidateId,
        'conversationId': value.conversationId,
        'workspaceId': value.workspaceId,
        'authorId': value.authorId,
        'parentId': value.parentId,
        'metadata': value.metadata,
        'attachments': value.attachments,
        'subject': value.subject,
        'fromEmail': value.fromEmail,
        'toEmails': value.toEmails,
        'ccEmails': value.ccEmails,
        'bccEmails': value.bccEmails,
    };
}

