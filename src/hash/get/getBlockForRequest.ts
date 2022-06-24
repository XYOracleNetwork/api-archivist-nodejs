import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { findByHash, requestCanAccessArchive } from '../../lib'
import { PayloadPointer, payloadPointerSchema } from './PayloadPointer'
import { resolvePayloadPointer } from './resolvePayloadPointer'

export const getBlockForRequest = async (req: Request, hash: string): Promise<XyoPayload | undefined> => {
  for (const block of await findByHash(hash)) {
    if (!block?._archive) {
      continue
    }
    if (await requestCanAccessArchive(req, block._archive)) {
      return block.schema === payloadPointerSchema ? await resolvePayloadPointer(req, block as XyoPayload<PayloadPointer>) : block
    }
  }
}
