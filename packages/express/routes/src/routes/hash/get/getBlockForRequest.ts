import { requestCanAccessArchive } from '@xyo-network/archivist-express-lib'
import { PayloadPointerPayload, payloadPointerSchema, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { resolvePayloadPointer } from './resolvePayloadPointer'

const findByHash = async (req: Request, hash: string) => {
  const { payloadsArchivist, boundWitnessesArchivist } = req.app
  const filter: XyoPayloadFilterPredicate = { hash }
  const payloads: XyoPayloadWithMeta[] = await payloadsArchivist.find(filter)
  return payloads.length ? payloads : await boundWitnessesArchivist.find({ ...filter, schema: 'network.xyo.boundwitness' })
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
