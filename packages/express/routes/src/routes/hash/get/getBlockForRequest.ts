import { exists } from '@xylabs/sdk-js'
import { XyoArchivistFindQuery, XyoArchivistFindQuerySchema } from '@xyo-network/archivist'
import { requestCanAccessArchive } from '@xyo-network/archivist-express-lib'
import { PayloadPointerPayload, payloadPointerSchema, XyoPayloadFilterPredicate, XyoPayloadWithMeta } from '@xyo-network/archivist-model'
import { QueryBoundWitnessBuilder } from '@xyo-network/module'
import { PayloadWrapper, XyoPayload } from '@xyo-network/payload'
import { Request } from 'express'

import { resolvePayloadPointer } from './resolvePayloadPointer'

const findByHash = async (req: Request, hash: string) => {
  const { payloadsArchivist, boundWitnessesArchivist } = req.app
  const payloadFilter: XyoPayloadFilterPredicate = { hash }
  const payloadQuery: XyoArchivistFindQuery = {
    filter: payloadFilter,
    schema: XyoArchivistFindQuerySchema,
  }
  const payloadQueryWitness = new QueryBoundWitnessBuilder().query(PayloadWrapper.hash(payloadQuery)).payload(payloadQuery).build()
  const payloads = (await payloadsArchivist.query(payloadQueryWitness, [payloadQuery]))?.[1].filter(exists) as XyoPayloadWithMeta[]
  if (payloads.length) return payloads
  const boundWitnessQuery: XyoArchivistFindQuery = {
    filter: { ...payloadFilter, schema: 'network.xyo.boundwitness' },
    schema: XyoArchivistFindQuerySchema,
  }
  const boundWitnessQueryWitness = new QueryBoundWitnessBuilder().query(PayloadWrapper.hash(boundWitnessQuery)).payload(boundWitnessQuery).build()
  return (await boundWitnessesArchivist.query(boundWitnessQueryWitness, [boundWitnessQuery]))?.[1].filter(exists)
}

export const getBlockForRequest = async (req: Request, hash: string): Promise<XyoPayload | undefined> => {
  for (const block of await findByHash(req, hash)) {
    const blockWithMeta = block as XyoPayloadWithMeta
    if (!blockWithMeta?._archive) {
      continue
    }
    if (await requestCanAccessArchive(req, blockWithMeta._archive)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return block.schema === payloadPointerSchema ? await resolvePayloadPointer(req, block as any as PayloadPointerPayload) : block
    }
  }
}
