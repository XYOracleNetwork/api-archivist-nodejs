import { exists } from '@xylabs/sdk-js'
import { requestCanAccessArchive } from '@xyo-network/archivist-express-lib'
import { PayloadPointerPayload, payloadPointerSchema, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/payload'
import { Request } from 'express'

import { resolvePayloadPointer } from './resolvePayloadPointer'

const findByHash = async (req: Request, hash: string) => {
  const { payloadsArchivist, boundWitnessesArchivist } = req.app
  const filter: XyoPayloadFilterPredicate = { hash }
  const payloads: XyoPayloadWithMeta[] = (await payloadsArchivist.find(filter)).filter(exists)
  return payloads.length ? payloads : (await boundWitnessesArchivist.find({ ...filter, schema: 'network.xyo.boundwitness' })).filter(exists)
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
