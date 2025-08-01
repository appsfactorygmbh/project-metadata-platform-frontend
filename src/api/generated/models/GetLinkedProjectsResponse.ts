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
 * Response for receiving the linked projects for a team.
 * @export
 * @interface GetLinkedProjectsResponse
 */
export interface GetLinkedProjectsResponse {
  /**
   * A list of project slugs the team is linked to.
   * @type {Array<string>}
   * @memberof GetLinkedProjectsResponse
   */
  projectSlugs: Array<string>;
}

/**
 * Check if a given object implements the GetLinkedProjectsResponse interface.
 */
export function instanceOfGetLinkedProjectsResponse(
  value: object,
): value is GetLinkedProjectsResponse {
  if (!('projectSlugs' in value) || value['projectSlugs'] === undefined)
    return false;
  return true;
}

export function GetLinkedProjectsResponseFromJSON(
  json: any,
): GetLinkedProjectsResponse {
  return GetLinkedProjectsResponseFromJSONTyped(json, false);
}

export function GetLinkedProjectsResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetLinkedProjectsResponse {
  if (json == null) {
    return json;
  }
  return {
    projectSlugs: json['projectSlugs'],
  };
}

export function GetLinkedProjectsResponseToJSON(
  json: any,
): GetLinkedProjectsResponse {
  return GetLinkedProjectsResponseToJSONTyped(json, false);
}

export function GetLinkedProjectsResponseToJSONTyped(
  value?: GetLinkedProjectsResponse | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    projectSlugs: value['projectSlugs'],
  };
}
