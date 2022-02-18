/**
 * Within a given API, each resource object's type and id pair MUST identify a single, unique resource. (The set of URIs controlled by a server, or multiple servers acting as one, constitute an API.)
 */
export interface ApiResourceIdentifierObject {
  /**
   * The id member is not required when the resource object originates at the client and represents a new resource to be created on the server.
   */
  id: string
  /**
   * The type member is used to describe resource objects that share common attributes and relationships. The values of type members MUST adhere to the same constraints as member names.
   */
  type: string
}
