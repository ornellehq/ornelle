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
 * @interface UpdateWorkspaceRequestLogo
 */
export interface UpdateWorkspaceRequestLogo {
    /**
     * 
     * @type {string}
     * @memberof UpdateWorkspaceRequestLogo
     */
    base64: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateWorkspaceRequestLogo
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateWorkspaceRequestLogo
     */
    mime: string;
    /**
     * 
     * @type {number}
     * @memberof UpdateWorkspaceRequestLogo
     */
    size: number;
}

/**
 * Check if a given object implements the UpdateWorkspaceRequestLogo interface.
 */
export function instanceOfUpdateWorkspaceRequestLogo(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "base64" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "mime" in value;
    isInstance = isInstance && "size" in value;

    return isInstance;
}

export function UpdateWorkspaceRequestLogoFromJSON(json: any): UpdateWorkspaceRequestLogo {
    return UpdateWorkspaceRequestLogoFromJSONTyped(json, false);
}

export function UpdateWorkspaceRequestLogoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateWorkspaceRequestLogo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'base64': json['base64'],
        'name': json['name'],
        'mime': json['mime'],
        'size': json['size'],
    };
}

export function UpdateWorkspaceRequestLogoToJSON(value?: UpdateWorkspaceRequestLogo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'base64': value.base64,
        'name': value.name,
        'mime': value.mime,
        'size': value.size,
    };
}

