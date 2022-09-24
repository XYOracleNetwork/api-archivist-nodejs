import { XyoArchivistFindQuery, XyoArchivistFindQuerySchema } from '@xyo-network/archivist'
import { BoundWitnessesArchivist, PayloadsArchivist, PayloadSearchCriteria, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness'
import { PayloadWrapper, XyoPayload } from '@xyo-network/payload'

const createPayloadFilterFromSearchCriteria = (searchCriteria: PayloadSearchCriteria): XyoPayloadFilterPredicate => {
  const { archives, direction, schemas, timestamp } = searchCriteria
  const order = direction === 'asc' ? 'asc' : 'desc'
  const query: XyoPayloadFilterPredicate = { order, timestamp }
  if (archives?.length) query.archives = archives
  if (schemas?.length) query.schemas = schemas
  return query
}

const isPayloadSignedByAddress = async (archivist: BoundWitnessesArchivist, hash: string, addresses: string[]): Promise<boolean> => {
  const filter = { addresses, limit: 1, payload_hashes: [hash] }
  const query: XyoArchivistFindQuery = {
    filter,
    schema: XyoArchivistFindQuerySchema,
  }
  const bw = new BoundWitnessBuilder().payload(query).build()
  const result = await archivist.query(bw, query)
  return result?.[1].length > 0
}

export const findPayload = async (
  boundWitnessesArchivist: BoundWitnessesArchivist,
  payloadsArchivist: PayloadsArchivist,
  searchCriteria: PayloadSearchCriteria,
): Promise<XyoPayload | undefined> => {
  const { addresses } = searchCriteria
  const filter = createPayloadFilterFromSearchCriteria(searchCriteria)
  const query: XyoArchivistFindQuery = {
    filter,
    schema: XyoArchivistFindQuerySchema,
  }
  const bw = new BoundWitnessBuilder().payload(query).build()
  const result = await payloadsArchivist.query(bw, query)
  const payload = result?.[1]?.[0] ?? undefined
  if (payload && addresses.length) {
    const hash = new PayloadWrapper(payload).hash
    const signed = await isPayloadSignedByAddress(boundWitnessesArchivist, hash, addresses)
    return signed ? payload : undefined
  } else {
    return payload
  }
}
