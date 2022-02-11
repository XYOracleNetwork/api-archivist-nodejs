/**
 * Loosely following the JSON API 1.0 formats and conventions
 * https://jsonapi.org/format/
 */

import { IErrorObject } from './error'
import { Links } from './links'
import { Relationship } from './relationship'

/**
 * Within a given API, each resource object's type and id pair MUST identify a single, unique resource. (The set of URIs controlled by a server, or multiple servers acting as one, constitute an API.)
 */
export interface IResourceIdentifierObject {
  /**
   * The id member is not required when the resource object originates at the client and represents a new resource to be created on the server.
   */
  id: string
  /**
   * The type member is used to describe resource objects that share common attributes and relationships. The values of type members MUST adhere to the same constraints as member names.
   */
  type: string
}

export interface IResourceObject extends IResourceIdentifierObject {
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
  links?: Links
  /**
   * A meta object containing non-standard meta-information about a resource that can not be represented as an attribute or relationship.
   */
  meta?: Record<string, unknown>
}

export interface IJsonApi {
  version?: '1.0' | '1.1'
  meta?: Record<string, unknown>
}

export interface IResponseBase {
  meta?: Record<string, unknown>
  jsonapi?: IJsonApi
  links?: Links
}

export interface IDataResponse<T extends IResourceIdentifierObject> extends IResponseBase {
  data: T
  included?: IResourceObject[]
}
export interface IErrorResponse extends IResponseBase {
  errors: IErrorObject[]
}

export type IResponse<T extends IResourceIdentifierObject> = IDataResponse<T> | IErrorResponse
