import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Filter, SortDirection } from 'mongodb'

import { getArchivistAllPayloadMongoSdk } from '../dbSdk'

// TODO: Refactor to inject payload repository
export const findPayload = async (archive: string[], timestamp: number = Date.now(), order: SortDirection = 'desc', schema?: string[]): Promise<XyoPayload | undefined> => {
  const sdk = getArchivistAllPayloadMongoSdk()
  const _timestamp = order === 'desc' ? { $lt: timestamp } : { $gt: timestamp }
  const query: Filter<XyoPayload> = { _archive: { $in: archive }, _timestamp }
  if (schema) query.schema = { $in: schema }
  const sort: { [key: string]: SortDirection } = { _timestamp: order === 'asc' ? 1 : -1 }
  const result = await (await sdk.find(query)).sort(sort).limit(1).toArray()
  return result[0] || undefined
}
