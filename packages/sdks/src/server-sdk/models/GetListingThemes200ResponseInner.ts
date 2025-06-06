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
 * @interface GetListingThemes200ResponseInner
 */
export interface GetListingThemes200ResponseInner {
    /**
     * 
     * @type {string}
     * @memberof GetListingThemes200ResponseInner
     */
    key: string;
    /**
     * 
     * @type {Date}
     * @memberof GetListingThemes200ResponseInner
     */
    updatedAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof GetListingThemes200ResponseInner
     */
    createdAt: Date;
    /**
     * 
     * @type {string}
     * @memberof GetListingThemes200ResponseInner
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof GetListingThemes200ResponseInner
     */
    workspaceId: string;
    /**
     * 
     * @type {any}
     * @memberof GetListingThemes200ResponseInner
     */
    openingsConfig: any | null;
    /**
     * 
     * @type {any}
     * @memberof GetListingThemes200ResponseInner
     */
    openingConfig: any | null;
    /**
     * 
     * @type {boolean}
     * @memberof GetListingThemes200ResponseInner
     */
    active?: boolean;
}

/**
 * Check if a given object implements the GetListingThemes200ResponseInner interface.
 */
export function instanceOfGetListingThemes200ResponseInner(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "key" in value;
    isInstance = isInstance && "updatedAt" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "workspaceId" in value;
    isInstance = isInstance && "openingsConfig" in value;
    isInstance = isInstance && "openingConfig" in value;

    return isInstance;
}

export function GetListingThemes200ResponseInnerFromJSON(json: any): GetListingThemes200ResponseInner {
    return GetListingThemes200ResponseInnerFromJSONTyped(json, false);
}

export function GetListingThemes200ResponseInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetListingThemes200ResponseInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'key': json['key'],
        'updatedAt': (new Date(json['updatedAt'])),
        'createdAt': (new Date(json['createdAt'])),
        'name': json['name'],
        'workspaceId': json['workspaceId'],
        'openingsConfig': json['openingsConfig'],
        'openingConfig': json['openingConfig'],
        'active': !exists(json, 'active') ? undefined : json['active'],
    };
}

export function GetListingThemes200ResponseInnerToJSON(value?: GetListingThemes200ResponseInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'key': value.key,
        'updatedAt': (value.updatedAt.toISOString()),
        'createdAt': (value.createdAt.toISOString()),
        'name': value.name,
        'workspaceId': value.workspaceId,
        'openingsConfig': value.openingsConfig,
        'openingConfig': value.openingConfig,
        'active': value.active,
    };
}

