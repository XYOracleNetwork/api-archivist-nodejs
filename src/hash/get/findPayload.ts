import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Filter, SortDirection } from 'mongodb'

import { getArchivistAllPayloadMongoSdk } from '../../lib'
import { PayloadSearchCriteria } from './PayloadRules'

const createQueryFromSearchCriteria = (searchCriteria: PayloadSearchCriteria): Filter<XyoPayload> => {
  const { timestamp, schemas, archives, direction } = searchCriteria
  const _timestamp = direction === 'desc' ? { $lt: timestamp } : { $gt: timestamp }
  const query: Filter<XyoPayload> = { _archive: { $in: archives }, _timestamp }
  if (schemas) query.schema = { $in: schemas }
  return query
}

const createSortFromSearchCriteria = (searchCriteria: PayloadSearchCriteria): { [key: string]: SortDirection } => {
  const { direction } = searchCriteria
  return { _timestamp: direction === 'asc' ? 1 : -1 }
}

// TODO: Refactor to inject payload repository
export const findPayload = async (searchCriteria: PayloadSearchCriteria): Promise<XyoPayload | undefined> => {
  const sdk = getArchivistAllPayloadMongoSdk()
  const query = createQueryFromSearchCriteria(searchCriteria)
  const sort = createSortFromSearchCriteria(searchCriteria)
  const result = await (await sdk.find(query)).sort(sort).limit(1).toArray()
  const payload = result[0] || undefined
  if (payload && searchCriteria.addresses.length) {
    // We need to find this hash signed by any of the addresses
    throw new Error('Not implemented')
  }
  return payload
}
