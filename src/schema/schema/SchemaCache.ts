import { Huri, XyoDomainConfigWrapper, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import LRU from 'lru-cache'

import { findOnePayloadByHash } from '../../lib'

export class SchemaCache {
  private cache = new LRU<string, XyoPayload | null>({ max: 500, ttl: 1000 * 60 * 5 })

  private constructor() {
    return
  }

  public async get(schema: string) {
    if (this.cache.get(schema) === undefined) {
      const schemaHuri = (await XyoDomainConfigWrapper.discover(schema))?.schema?.[schema]

      if (schemaHuri) {
        const huri = new Huri(schemaHuri)
        const payload = await findOnePayloadByHash(huri.hash)
        this.cache.set(schema, payload ?? null)
      }
    }
    return this.cache.get(schema)
  }

  private static instance?: SchemaCache
  static get() {
    if (!this.instance) {
      this.instance = new SchemaCache()
    }
    return this.instance
  }
}
