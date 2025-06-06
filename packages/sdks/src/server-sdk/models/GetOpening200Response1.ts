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
import type { GetOpening200Response1Application } from './GetOpening200Response1Application';
import {
    GetOpening200Response1ApplicationFromJSON,
    GetOpening200Response1ApplicationFromJSONTyped,
    GetOpening200Response1ApplicationToJSON,
} from './GetOpening200Response1Application';
import type { GetOpening200Response1Content } from './GetOpening200Response1Content';
import {
    GetOpening200Response1ContentFromJSON,
    GetOpening200Response1ContentFromJSONTyped,
    GetOpening200Response1ContentToJSON,
} from './GetOpening200Response1Content';
import type { GetOpening200Response1Opening } from './GetOpening200Response1Opening';
import {
    GetOpening200Response1OpeningFromJSON,
    GetOpening200Response1OpeningFromJSONTyped,
    GetOpening200Response1OpeningToJSON,
} from './GetOpening200Response1Opening';
import type { GetOpening200Response1Workspace } from './GetOpening200Response1Workspace';
import {
    GetOpening200Response1WorkspaceFromJSON,
    GetOpening200Response1WorkspaceFromJSONTyped,
    GetOpening200Response1WorkspaceToJSON,
} from './GetOpening200Response1Workspace';

/**
 * 
 * @export
 * @interface GetOpening200Response1
 */
export interface GetOpening200Response1 {
    /**
     * 
     * @type {GetOpening200Response1Workspace}
     * @memberof GetOpening200Response1
     */
    workspace: GetOpening200Response1Workspace;
    /**
     * 
     * @type {GetOpening200Response1Content}
     * @memberof GetOpening200Response1
     */
    content: GetOpening200Response1Content;
    /**
     * 
     * @type {GetOpening200Response1Opening}
     * @memberof GetOpening200Response1
     */
    opening: GetOpening200Response1Opening;
    /**
     * 
     * @type {Array<string>}
     * @memberof GetOpening200Response1
     */
    propertiesToShow: Array<string>;
    /**
     * 
     * @type {GetOpening200Response1Application}
     * @memberof GetOpening200Response1
     */
    application?: GetOpening200Response1Application;
}

/**
 * Check if a given object implements the GetOpening200Response1 interface.
 */
export function instanceOfGetOpening200Response1(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "workspace" in value;
    isInstance = isInstance && "content" in value;
    isInstance = isInstance && "opening" in value;
    isInstance = isInstance && "propertiesToShow" in value;

    return isInstance;
}

export function GetOpening200Response1FromJSON(json: any): GetOpening200Response1 {
    return GetOpening200Response1FromJSONTyped(json, false);
}

export function GetOpening200Response1FromJSONTyped(json: any, ignoreDiscriminator: boolean): GetOpening200Response1 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'workspace': GetOpening200Response1WorkspaceFromJSON(json['workspace']),
        'content': GetOpening200Response1ContentFromJSON(json['content']),
        'opening': GetOpening200Response1OpeningFromJSON(json['opening']),
        'propertiesToShow': json['propertiesToShow'],
        'application': !exists(json, 'application') ? undefined : GetOpening200Response1ApplicationFromJSON(json['application']),
    };
}

export function GetOpening200Response1ToJSON(value?: GetOpening200Response1 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'workspace': GetOpening200Response1WorkspaceToJSON(value.workspace),
        'content': GetOpening200Response1ContentToJSON(value.content),
        'opening': GetOpening200Response1OpeningToJSON(value.opening),
        'propertiesToShow': value.propertiesToShow,
        'application': GetOpening200Response1ApplicationToJSON(value.application),
    };
}

