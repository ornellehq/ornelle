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
 * @interface UpdateProfileByIDRequest
 */
export interface UpdateProfileByIDRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdateProfileByIDRequest
     */
    permissionId?: string;
    /**
     * 
     * @type {boolean}
     * @memberof UpdateProfileByIDRequest
     */
    activate?: boolean;
}

/**
 * Check if a given object implements the UpdateProfileByIDRequest interface.
 */
export function instanceOfUpdateProfileByIDRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UpdateProfileByIDRequestFromJSON(json: any): UpdateProfileByIDRequest {
    return UpdateProfileByIDRequestFromJSONTyped(json, false);
}

export function UpdateProfileByIDRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateProfileByIDRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'permissionId': !exists(json, 'permissionId') ? undefined : json['permissionId'],
        'activate': !exists(json, 'activate') ? undefined : json['activate'],
    };
}

export function UpdateProfileByIDRequestToJSON(value?: UpdateProfileByIDRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'permissionId': value.permissionId,
        'activate': value.activate,
    };
}

