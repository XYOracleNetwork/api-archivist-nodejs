import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Filter, SortDirection } from 'mongodb'

import { getArchivistAllPayloadMongoSdk } from '../../lib'
import { PayloadSearchCriteria } from './PayloadRules'

// TODO: Refactor to inject payload repository
export const findPayload = async (searchCriteria: PayloadSearchCriteria): Promise<XyoPayload | undefined> => {
  const { timestamp, schema, archive, direction } = searchCriteria
  const sdk = getArchivistAllPayloadMongoSdk()
  const _timestamp = direction === 'desc' ? { $lt: timestamp } : { $gt: timestamp }
  const query: Filter<XyoPayload> = { _archive: { $in: archive }, _timestamp }
  if (schema) query.schema = { $in: schema }
  const sort: { [key: string]: SortDirection } = { _timestamp: direction === 'asc' ? 1 : -1 }
  const result = await (await sdk.find(query)).sort(sort).limit(1).toArray()
  return result[0] || undefined
}
