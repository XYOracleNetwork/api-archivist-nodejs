/**
 * Loosely following the JSON API 1.0 formats and conventions
 * https://jsonapi.org/format/
 */

import { ApiError } from './error'
import { ApiLinks } from './links'
import { Relationship } from './relationship'
import { ApiResourceIdentifierObject } from './resourceIdentifier'

export interface ApiResourceObject extends ApiResourceIdentifierObject {
  /**
   * An attributes object representing some of the resource's data.
   */
  attributes?: Record<string, unknown>
  /**
   * A relationships object describing relationships between the resource and other JSON:API resources.
   */
  relationships?: Record<string, Relationship>
  /**
   * A links object containing links related to the resource.
   */
  links?: ApiLinks
  /**
   * A meta object containing non-standard meta-information about a resource that can not be represented as an attribute or relationship.
   */
  meta?: Record<string, unknown>
}

export interface JsonApi {
  version?: '1.0' | '1.1'
  meta?: Record<string, unknown>
}

export interface ApiResponseBase {
  meta?: Record<string, unknown>
  jsonapi?: JsonApi
  links?: ApiLinks
}

export interface ApiDataResponse<T extends ApiResourceIdentifierObject> extends ApiResponseBase {
  data: T
  included?: ApiResourceObject[]
}
export interface ApiErrorResponse extends ApiResponseBase {
  errors: ApiError[]
}

export type ApiResponse<T extends ApiResourceIdentifierObject> = ApiDataResponse<T> | ApiErrorResponse
