import { XyoPayload, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'
import { Filter, SortDirection } from 'mongodb'

import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../../lib'
import { PayloadSearchCriteria } from './PayloadRules'

const createPayloadQueryFromSearchCriteria = (searchCriteria: PayloadSearchCriteria): Filter<XyoPayload> => {
  const { timestamp, schemas, archives, direction } = searchCriteria
  const _timestamp = direction === 'desc' ? { $lt: timestamp } : { $gt: timestamp }
  const query: Filter<XyoPayload> = { _archive: { $in: archives }, _timestamp }
  if (schemas) query.schema = { $in: schemas }
  return query
}

const createPayloadSortFromSearchCriteria = (searchCriteria: PayloadSearchCriteria): { [key: string]: SortDirection } => {
  const { direction } = searchCriteria
  return { _timestamp: direction === 'asc' ? 1 : -1 }
}

// TODO: Refactor to inject BW repository
const isPayloadSignedByAddress = async (hash: string, addresses: string[]): Promise<boolean> => {
  const sdk = getArchivistAllBoundWitnessesMongoSdk()
  // NOTE: Defaulting to $all since it makes the most sense when singing addresses are supplied
  // but based on how MongoDB implements multi-key indexes $in might be much faster and we could
  // solve the multi-sig problem via multiple API calls when multi-sig is desired instead of
  // potentially impacting performance for all single-address queries
  const count = (await (await sdk.find({ addresses: { $all: addresses }, payload_hashes: hash })).limit(1).toArray()).length
  return count > 0
}

// TODO: Refactor to inject Payload repository
export const findPayload = async (searchCriteria: PayloadSearchCriteria): Promise<XyoPayload | undefined> => {
  const { addresses } = searchCriteria
  const sdk = getArchivistAllPayloadMongoSdk()
  const query = createPayloadQueryFromSearchCriteria(searchCriteria)
  const sort = createPayloadSortFromSearchCriteria(searchCriteria)
  const result = await (await sdk.find(query)).sort(sort).limit(1).toArray()
  const payload = result[0] || undefined
  if (payload && addresses.length) {
    const hash = new XyoPayloadWrapper(payload).hash
    const signed = await isPayloadSignedByAddress(hash, addresses)
    return signed ? payload : undefined
  } else {
    return payload
  }
}
