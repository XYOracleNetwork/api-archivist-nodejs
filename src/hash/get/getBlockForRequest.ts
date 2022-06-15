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
      if (block.schema === payloadPointerSchema) {
        const pointer = block as XyoPayload<PayloadPointer>
        if (await requestCanAccessArchive(req, pointer.reference.archive)) {
          return resolvePayloadPointer(pointer)
        }
      } else {
        return block
      }
    }
  }
}
