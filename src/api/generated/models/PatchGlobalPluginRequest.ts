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
 * Represents a request to patch a global plugin.
 * @export
 * @interface PatchGlobalPluginRequest
 */
export interface PatchGlobalPluginRequest {
  /**
   * The name of the plugin. Null if not being updated.
   * @type {string}
   * @memberof PatchGlobalPluginRequest
   */
  pluginName?: string | null;
  /**
   * The archived status of the plugin. Null if not being updated.
   * @type {boolean}
   * @memberof PatchGlobalPluginRequest
   */
  isArchived?: boolean | null;
  /**
   * An array of keys associated with the plugin.
   * @type {Array<string>}
   * @memberof PatchGlobalPluginRequest
   */
  keys?: Array<string> | null;
  /**
   * The base url of the plugin.
   * @type {string}
   * @memberof PatchGlobalPluginRequest
   */
  baseUrl?: string | null;
}

/**
 * Check if a given object implements the PatchGlobalPluginRequest interface.
 */
export function instanceOfPatchGlobalPluginRequest(
  value: object,
): value is PatchGlobalPluginRequest {
  return true;
}

export function PatchGlobalPluginRequestFromJSON(
  json: any,
): PatchGlobalPluginRequest {
  return PatchGlobalPluginRequestFromJSONTyped(json, false);
}

export function PatchGlobalPluginRequestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): PatchGlobalPluginRequest {
  if (json == null) {
    return json;
  }
  return {
    pluginName: json['pluginName'] == null ? undefined : json['pluginName'],
    isArchived: json['isArchived'] == null ? undefined : json['isArchived'],
    keys: json['keys'] == null ? undefined : json['keys'],
    baseUrl: json['baseUrl'] == null ? undefined : json['baseUrl'],
  };
}

export function PatchGlobalPluginRequestToJSON(
  json: any,
): PatchGlobalPluginRequest {
  return PatchGlobalPluginRequestToJSONTyped(json, false);
}

export function PatchGlobalPluginRequestToJSONTyped(
  value?: PatchGlobalPluginRequest | null,
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
