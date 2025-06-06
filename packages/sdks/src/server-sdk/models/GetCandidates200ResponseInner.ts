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
 * @interface GetCandidates200ResponseInner
 */
export interface GetCandidates200ResponseInner {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof GetCandidates200ResponseInner
     */
    id: string;
    /**
     * 
     * @type {Date}
     * @memberof GetCandidates200ResponseInner
     */
    updatedAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof GetCandidates200ResponseInner
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetCandidates200ResponseInner
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof GetCandidates200ResponseInner
     */
    lastName: string;
    /**
     * 
     * @type {string}
     * @memberof GetCandidates200ResponseInner
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof GetCandidates200ResponseInner
     */
    workspaceId: string;
    /**
     * 
     * @type {any}
     * @memberof GetCandidates200ResponseInner
     */
    creatorId?: any | null;
    /**
     * 
     * @type {number}
     * @memberof GetCandidates200ResponseInner
     */
    numberInWorkspace: number;
    /**
     * 
     * @type {any}
     * @memberof GetCandidates200ResponseInner
     */
    deletedAt?: any | null;
    /**
     * 
     * @type {number}
     * @memberof GetCandidates200ResponseInner
     */
    applicationsCount: number;
}

/**
 * Check if a given object implements the GetCandidates200ResponseInner interface.
 */
export function instanceOfGetCandidates200ResponseInner(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "updatedAt" in value;
    isInstance = isInstance && "firstName" in value;
    isInstance = isInstance && "lastName" in value;
    isInstance = isInstance && "email" in value;
    isInstance = isInstance && "workspaceId" in value;
    isInstance = isInstance && "numberInWorkspace" in value;
    isInstance = isInstance && "applicationsCount" in value;

    return isInstance;
}

export function GetCandidates200ResponseInnerFromJSON(json: any): GetCandidates200ResponseInner {
    return GetCandidates200ResponseInnerFromJSONTyped(json, false);
}

export function GetCandidates200ResponseInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetCandidates200ResponseInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
            ...json,
        'id': json['id'],
        'updatedAt': (new Date(json['updatedAt'])),
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'firstName': json['firstName'],
        'lastName': json['lastName'],
        'email': json['email'],
        'workspaceId': json['workspaceId'],
        'creatorId': !exists(json, 'creatorId') ? undefined : json['creatorId'],
        'numberInWorkspace': json['numberInWorkspace'],
        'deletedAt': !exists(json, 'deletedAt') ? undefined : json['deletedAt'],
        'applicationsCount': json['applicationsCount'],
    };
}

export function GetCandidates200ResponseInnerToJSON(value?: GetCandidates200ResponseInner | null): any {
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
        'createdAt': value.createdAt === undefined ? undefined : (value.createdAt.toISOString()),
        'firstName': value.firstName,
        'lastName': value.lastName,
        'email': value.email,
        'workspaceId': value.workspaceId,
        'creatorId': value.creatorId,
        'numberInWorkspace': value.numberInWorkspace,
        'deletedAt': value.deletedAt,
        'applicationsCount': value.applicationsCount,
    };
}

