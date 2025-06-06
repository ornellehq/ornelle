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
import type { CreateAttributeRequestConfiguration } from './CreateAttributeRequestConfiguration';
import {
    CreateAttributeRequestConfigurationFromJSON,
    CreateAttributeRequestConfigurationFromJSONTyped,
    CreateAttributeRequestConfigurationToJSON,
} from './CreateAttributeRequestConfiguration';

/**
 * 
 * @export
 * @interface UpdateAttributeRequest
 */
export interface UpdateAttributeRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdateAttributeRequest
     */
    name?: string;
    /**
     * 
     * @type {CreateAttributeRequestConfiguration}
     * @memberof UpdateAttributeRequest
     */
    _configuration?: CreateAttributeRequestConfiguration;
}

/**
 * Check if a given object implements the UpdateAttributeRequest interface.
 */
export function instanceOfUpdateAttributeRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UpdateAttributeRequestFromJSON(json: any): UpdateAttributeRequest {
    return UpdateAttributeRequestFromJSONTyped(json, false);
}

export function UpdateAttributeRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateAttributeRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        '_configuration': !exists(json, 'configuration') ? undefined : CreateAttributeRequestConfigurationFromJSON(json['configuration']),
    };
}

export function UpdateAttributeRequestToJSON(value?: UpdateAttributeRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'configuration': CreateAttributeRequestConfigurationToJSON(value._configuration),
    };
}

