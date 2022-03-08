import { XyoDomainConfigWrapper, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import LRU from 'lru-cache'

import { findByHash } from '../../lib'

export class SchemaCache {
  private cache = new LRU<string, XyoPayload | null>({ max: 500, ttl: 1000 * 60 * 5 })

  private constructor() {
    return
  }

  public async get(schema: string) {
    if (this.cache.get(schema) === undefined) {
      const config = new XyoDomainConfigWrapper()

      const schemaHash = (await config.discover(schema))?.schema?.[schema]
      if (schemaHash) {
        const payload = (await findByHash(schemaHash, 'schemas')) as XyoPayload
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
