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
 * Enum indicating the security level of a project. The higher the security level, the more sensitive the project is.
 * @export
 */
export const SecurityLevel = {
  Normal: 'NORMAL',
  High: 'HIGH',
  VeryHigh: 'VERY_HIGH',
} as const;
export type SecurityLevel = (typeof SecurityLevel)[keyof typeof SecurityLevel];

export function instanceOfSecurityLevel(value: any): boolean {
  for (const key in SecurityLevel) {
    if (Object.prototype.hasOwnProperty.call(SecurityLevel, key)) {
      if (SecurityLevel[key as keyof typeof SecurityLevel] === value) {
        return true;
      }
    }
  }
  return false;
}

export function SecurityLevelFromJSON(json: any): SecurityLevel {
  return SecurityLevelFromJSONTyped(json, false);
}

export function SecurityLevelFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): SecurityLevel {
  return json as SecurityLevel;
}

export function SecurityLevelToJSON(value?: SecurityLevel | null): any {
  return value as any;
}

export function SecurityLevelToJSONTyped(
  value: any,
  ignoreDiscriminator: boolean,
): SecurityLevel {
  return value as SecurityLevel;
}
