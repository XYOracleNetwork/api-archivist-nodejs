import { getArchivistAllBoundWitnessesMongoSdk } from '@xyo-network/archivist-lib'
import { BoundWitnessesArchivist, PayloadsArchivist, PayloadSearchCriteria, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayload, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'

const createPayloadFilterFromSearchCriteria = (searchCriteria: PayloadSearchCriteria): XyoPayloadFilterPredicate => {
  const { direction, schemas, timestamp } = searchCriteria
  const order = direction === 'asc' ? 'asc' : 'desc'
  const query: XyoPayloadFilterPredicate = { order, timestamp }
  if (schemas) query.schemas
  return query
}

// TODO: Refactor to inject BW repository
const isPayloadSignedByAddress = async (archivist: BoundWitnessesArchivist, hash: string, addresses: string[]): Promise<boolean> => {
  const sdk = getArchivistAllBoundWitnessesMongoSdk()
  // NOTE: Defaulting to $all since it makes the most sense when singing addresses are supplied
  // but based on how MongoDB implements multi-key indexes $in might be much faster and we could
  // solve the multi-sig problem via multiple API calls when multi-sig is desired instead of
  // potentially impacting performance for all single-address queries
  const count = (await (await sdk.find({ addresses: { $all: addresses }, payload_hashes: hash })).limit(1).toArray()).length
  return count > 0
}

// TODO: Refactor to inject Payload repository
export const findPayload = async (
  boundWitnessesArchivist: BoundWitnessesArchivist,
  payloadsArchivist: PayloadsArchivist,
  searchCriteria: PayloadSearchCriteria,
): Promise<XyoPayload | undefined> => {
  const { addresses } = searchCriteria
  const query = createPayloadFilterFromSearchCriteria(searchCriteria)
  const result = await payloadsArchivist.find(query)
  const payload = result[0] || undefined
  if (payload && addresses.length) {
    const hash = new XyoPayloadWrapper(payload).hash
    const signed = await isPayloadSignedByAddress(boundWitnessesArchivist, hash, addresses)
    return signed ? payload : undefined
  } else {
    return payload
  }
}
