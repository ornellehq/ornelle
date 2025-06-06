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
import type { GetOpening200ResponseForm } from './GetOpening200ResponseForm';
import {
    GetOpening200ResponseFormFromJSON,
    GetOpening200ResponseFormFromJSONTyped,
    GetOpening200ResponseFormToJSON,
} from './GetOpening200ResponseForm';
import type { GetOpenings200ResponseInnerRole } from './GetOpenings200ResponseInnerRole';
import {
    GetOpenings200ResponseInnerRoleFromJSON,
    GetOpenings200ResponseInnerRoleFromJSONTyped,
    GetOpenings200ResponseInnerRoleToJSON,
} from './GetOpenings200ResponseInnerRole';

/**
 * 
 * @export
 * @interface GetOpening200Response1Opening
 */
export interface GetOpening200Response1Opening {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof GetOpening200Response1Opening
     */
    id: string;
    /**
     * 
     * @type {Date}
     * @memberof GetOpening200Response1Opening
     */
    updatedAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof GetOpening200Response1Opening
     */
    createdAt: Date;
    /**
     * 
     * @type {string}
     * @memberof GetOpening200Response1Opening
     */
    title: string;
    /**
     * 
     * @type {GetApplications200ResponseInnerNotes}
     * @memberof GetOpening200Response1Opening
     */
    description?: GetApplications200ResponseInnerNotes;
    /**
     * 
     * @type {string}
     * @memberof GetOpening200Response1Opening
     */
    workspaceId: string;
    /**
     * 
     * @type {string}
     * @memberof GetOpening200Response1Opening
     */
    roleId: string;
    /**
     * 
     * @type {any}
     * @memberof GetOpening200Response1Opening
     */
    formId?: any | null;
    /**
     * 
     * @type {string}
     * @memberof GetOpening200Response1Opening
     */
    status?: GetOpening200Response1OpeningStatusEnum;
    /**
     * 
     * @type {any}
     * @memberof GetOpening200Response1Opening
     */
    deletedAt?: any | null;
    /**
     * 
     * @type {GetOpening200ResponseForm}
     * @memberof GetOpening200Response1Opening
     */
    form: GetOpening200ResponseForm;
    /**
     * 
     * @type {GetOpenings200ResponseInnerRole}
     * @memberof GetOpening200Response1Opening
     */
    role: GetOpenings200ResponseInnerRole;
}

/**
* @export
* @enum {string}
*/
export enum GetOpening200Response1OpeningStatusEnum {
    Published = 'Published',
    Draft = 'Draft'
}


/**
 * Check if a given object implements the GetOpening200Response1Opening interface.
 */
export function instanceOfGetOpening200Response1Opening(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "updatedAt" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "title" in value;
    isInstance = isInstance && "workspaceId" in value;
    isInstance = isInstance && "roleId" in value;
    isInstance = isInstance && "form" in value;
    isInstance = isInstance && "role" in value;

    return isInstance;
}

export function GetOpening200Response1OpeningFromJSON(json: any): GetOpening200Response1Opening {
    return GetOpening200Response1OpeningFromJSONTyped(json, false);
}

export function GetOpening200Response1OpeningFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetOpening200Response1Opening {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
            ...json,
        'id': json['id'],
        'updatedAt': (new Date(json['updatedAt'])),
        'createdAt': (new Date(json['createdAt'])),
        'title': json['title'],
        'description': !exists(json, 'description') ? undefined : GetApplications200ResponseInnerNotesFromJSON(json['description']),
        'workspaceId': json['workspaceId'],
        'roleId': json['roleId'],
        'formId': !exists(json, 'formId') ? undefined : json['formId'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'deletedAt': !exists(json, 'deletedAt') ? undefined : json['deletedAt'],
        'form': GetOpening200ResponseFormFromJSON(json['form']),
        'role': GetOpenings200ResponseInnerRoleFromJSON(json['role']),
    };
}

export function GetOpening200Response1OpeningToJSON(value?: GetOpening200Response1Opening | null): any {
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
        'title': value.title,
        'description': GetApplications200ResponseInnerNotesToJSON(value.description),
        'workspaceId': value.workspaceId,
        'roleId': value.roleId,
        'formId': value.formId,
        'status': value.status,
        'deletedAt': value.deletedAt,
        'form': GetOpening200ResponseFormToJSON(value.form),
        'role': GetOpenings200ResponseInnerRoleToJSON(value.role),
    };
}

