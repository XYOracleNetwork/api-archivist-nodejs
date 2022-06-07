import { assertEx } from '@xylabs/sdk-js'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

export abstract class Query<T extends XyoPayload = XyoPayload> {
  constructor(public readonly payload: T) {}
  /**
   * Defaults to returning a concatenated string of the the
   * payload hash + timestamp. Two queries with the exact same
   * hash/timestamp are assumed to be the same query. If this
   * behavior is not desirous, we should use some form of
   * random uniqueness (GUID) to prevent that from being true
   * @returns Correlation ID for the query
   */
  public id = (): string => {
    const hash = assertEx(this.payload._hash)
    const timestamp = assertEx(this.payload._timestamp)
    return `${timestamp}-${hash}`
  }
}
