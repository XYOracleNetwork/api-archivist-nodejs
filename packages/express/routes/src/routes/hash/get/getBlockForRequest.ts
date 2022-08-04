import { findByHash, requestCanAccessArchive } from '@xyo-network/archivist-lib'
import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { PayloadPointerPayload, payloadPointerSchema } from './PayloadPointer'
import { resolvePayloadPointer } from './resolvePayloadPointer'

export const getBlockForRequest = async (req: Request, hash: string): Promise<XyoPayload | undefined> => {
  for (const block of await findByHash(hash)) {
    const blockWithMeta = block as XyoPayloadWithMeta
    if (!blockWithMeta?._archive) {
      continue
    }
    if (await requestCanAccessArchive(req, blockWithMeta._archive)) {
      return block.schema === payloadPointerSchema ? await resolvePayloadPointer(req, block as PayloadPointerPayload) : block
    }
  }
}
