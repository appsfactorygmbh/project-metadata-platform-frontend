/* tslint:disable */

/**
 * ProjectMetadataPlatform.Api
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * Request for creating a new plugin.
 * @export
 * @interface CreatePluginRequest
 */
export interface CreatePluginRequest {
  /**
   * The name of the new plugin.
   * @type {string}
   * @memberof CreatePluginRequest
   */
  pluginName: string;
  /**
   * A boolean indicating if a plugin is archived/deleted.
   * @type {boolean}
   * @memberof CreatePluginRequest
   */
  isArchived: boolean;
  /**
   * The keys of the new plugin.
   * @type {Array<string>}
   * @memberof CreatePluginRequest
   */
  keys: Array<string>;
  /**
   * Base Url of the new plugin.
   * @type {string}
   * @memberof CreatePluginRequest
   */
  baseUrl: string;
}

/**
 * Check if a given object implements the CreatePluginRequest interface.
 */
export function instanceOfCreatePluginRequest(
  value: object,
): value is CreatePluginRequest {
  if (!('pluginName' in value) || value['pluginName'] === undefined)
    return false;
  if (!('isArchived' in value) || value['isArchived'] === undefined)
    return false;
  if (!('keys' in value) || value['keys'] === undefined) return false;
  if (!('baseUrl' in value) || value['baseUrl'] === undefined) return false;
  return true;
}

export function CreatePluginRequestFromJSON(json: any): CreatePluginRequest {
  return CreatePluginRequestFromJSONTyped(json, false);
}

export function CreatePluginRequestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CreatePluginRequest {
  if (json == null) {
    return json;
  }
  return {
    pluginName: json['pluginName'],
    isArchived: json['isArchived'],
    keys: json['keys'],
    baseUrl: json['baseUrl'],
  };
}

export function CreatePluginRequestToJSON(json: any): CreatePluginRequest {
  return CreatePluginRequestToJSONTyped(json, false);
}

export function CreatePluginRequestToJSONTyped(
  value?: CreatePluginRequest | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    pluginName: value['pluginName'],
    isArchived: value['isArchived'],
    keys: value['keys'],
    baseUrl: value['baseUrl'],
  };
}
