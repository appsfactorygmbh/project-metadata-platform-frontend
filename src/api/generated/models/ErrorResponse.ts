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
 * Response model representing an error response.
 * @export
 * @interface ErrorResponse
 */
export interface ErrorResponse {
  /**
   * The error message.
   * @type {string}
   * @memberof ErrorResponse
   */
  message: string;
}

/**
 * Check if a given object implements the ErrorResponse interface.
 */
export function instanceOfErrorResponse(value: object): value is ErrorResponse {
  if (!('message' in value) || value['message'] === undefined) return false;
  return true;
}

export function ErrorResponseFromJSON(json: any): ErrorResponse {
  return ErrorResponseFromJSONTyped(json, false);
}

export function ErrorResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ErrorResponse {
  if (json == null) {
    return json;
  }
  return {
    message: json['message'],
  };
}

export function ErrorResponseToJSON(json: any): ErrorResponse {
  return ErrorResponseToJSONTyped(json, false);
}

export function ErrorResponseToJSONTyped(
  value?: ErrorResponse | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    message: value['message'],
  };
}
