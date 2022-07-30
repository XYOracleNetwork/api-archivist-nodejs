import { XyoSchemaCache, XyoSchemaCacheEntry } from '@xyo-network/sdk-xyo-client-js'

export const getAllCachedSchema = async (): Promise<XyoSchemaCacheEntry[]> => {
  // TODO: Enumerate all keys/entries within the schema cache
  // and potentially filter out by just schema in this archive
  await XyoSchemaCache.instance.get('')
  return [] as XyoSchemaCacheEntry[]
}
