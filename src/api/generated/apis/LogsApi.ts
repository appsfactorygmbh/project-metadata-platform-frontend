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

import * as runtime from '../runtime';
import type { LogResponse } from '../models/index';
import { LogResponseFromJSON } from '../models/index';

export interface LogsGetRequest {
  projectId?: number;
  search?: string;
  userId?: string;
  globalPluginId?: number;
  projectSlug?: string;
}

/**
 * LogsApi - interface
 *
 * @export
 * @interface LogsApiInterface
 */
export interface LogsApiInterface {
  /**
   *
   * @summary Retrieves log entries based on the specified project ID and search criteria.  Filters are optional and can *not* be used in combination.  if multiple filters are used, the first one will be used.  projectId > search > userId > globalPluginId
   * @param {number} [projectId] The ID of the project to filter logs by.
   * @param {string} [search] The search term to filter logs by.
   * @param {string} [userId] The ID of the affected user to filter logs by.
   * @param {number} [globalPluginId] The ID of the global plugin to filter logs by.
   * @param {string} [projectSlug] The slug of the project to filter logs by.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof LogsApiInterface
   */
  logsGetRaw(
    requestParameters: LogsGetRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<Array<LogResponse>>>;

  /**
   * Retrieves log entries based on the specified project ID and search criteria.  Filters are optional and can *not* be used in combination.  if multiple filters are used, the first one will be used.  projectId > search > userId > globalPluginId
   */
  logsGet(
    requestParameters: LogsGetRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<Array<LogResponse>>;
}

/**
 *
 */
export class LogsApi extends runtime.BaseAPI implements LogsApiInterface {
  /**
   * Retrieves log entries based on the specified project ID and search criteria.  Filters are optional and can *not* be used in combination.  if multiple filters are used, the first one will be used.  projectId > search > userId > globalPluginId
   */
  async logsGetRaw(
    requestParameters: LogsGetRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<Array<LogResponse>>> {
    const queryParameters: any = {};

    if (requestParameters['projectId'] != null) {
      queryParameters['projectId'] = requestParameters['projectId'];
    }

    if (requestParameters['search'] != null) {
      queryParameters['search'] = requestParameters['search'];
    }

    if (requestParameters['userId'] != null) {
      queryParameters['userId'] = requestParameters['userId'];
    }

    if (requestParameters['globalPluginId'] != null) {
      queryParameters['globalPluginId'] = requestParameters['globalPluginId'];
    }

    if (requestParameters['projectSlug'] != null) {
      queryParameters['projectSlug'] = requestParameters['projectSlug'];
    }

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization'] =
        await this.configuration.apiKey('Authorization'); // Bearer authentication
    }

    const response = await this.request(
      {
        path: `/Logs`,
        method: 'GET',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      jsonValue.map(LogResponseFromJSON),
    );
  }

  /**
   * Retrieves log entries based on the specified project ID and search criteria.  Filters are optional and can *not* be used in combination.  if multiple filters are used, the first one will be used.  projectId > search > userId > globalPluginId
   */
  async logsGet(
    requestParameters: LogsGetRequest = {},
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<Array<LogResponse>> {
    const response = await this.logsGetRaw(requestParameters, initOverrides);
    return await response.value();
  }
}
