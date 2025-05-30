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
import type { GetApplications200ResponseInnerNotes } from './GetApplications200ResponseInnerNotes';
import {
    GetApplications200ResponseInnerNotesFromJSON,
    GetApplications200ResponseInnerNotesFromJSONTyped,
    GetApplications200ResponseInnerNotesToJSON,
} from './GetApplications200ResponseInnerNotes';

/**
 * 
 * @export
 * @interface GetRoles200ResponseInner
 */
export interface GetRoles200ResponseInner {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof GetRoles200ResponseInner
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof GetRoles200ResponseInner
     */
    title: string;
    /**
     * 
     * @type {GetApplications200ResponseInnerNotes}
     * @memberof GetRoles200ResponseInner
     */
    description: GetApplications200ResponseInnerNotes;
    /**
     * 
     * @type {number}
     * @memberof GetRoles200ResponseInner
     */
    openingsCount: number;
}

/**
 * Check if a given object implements the GetRoles200ResponseInner interface.
 */
export function instanceOfGetRoles200ResponseInner(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "title" in value;
    isInstance = isInstance && "description" in value;
    isInstance = isInstance && "openingsCount" in value;

    return isInstance;
}

export function GetRoles200ResponseInnerFromJSON(json: any): GetRoles200ResponseInner {
    return GetRoles200ResponseInnerFromJSONTyped(json, false);
}

export function GetRoles200ResponseInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetRoles200ResponseInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
            ...json,
        'id': json['id'],
        'title': json['title'],
        'description': GetApplications200ResponseInnerNotesFromJSON(json['description']),
        'openingsCount': json['openingsCount'],
    };
}

export function GetRoles200ResponseInnerToJSON(value?: GetRoles200ResponseInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
            ...value,
        'id': value.id,
        'title': value.title,
        'description': GetApplications200ResponseInnerNotesToJSON(value.description),
        'openingsCount': value.openingsCount,
    };
}

