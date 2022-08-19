import { BoundWitnessesArchivist, PayloadsArchivist, PayloadSearchCriteria, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayload, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'

const createPayloadFilterFromSearchCriteria = (searchCriteria: PayloadSearchCriteria): XyoPayloadFilterPredicate => {
  const { archives, direction, schemas, timestamp } = searchCriteria
  const order = direction === 'asc' ? 'asc' : 'desc'
  const query: XyoPayloadFilterPredicate = { order, timestamp }
  if (archives?.length) query.archives = archives
  if (schemas?.length) query.schemas = schemas
  return query
}

const isPayloadSignedByAddress = async (archivist: BoundWitnessesArchivist, hash: string, addresses: string[]): Promise<boolean> => {
  const result = await archivist.find({ addresses, limit: 1, payload_hashes: [hash] })
  return result.length > 0
}

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
