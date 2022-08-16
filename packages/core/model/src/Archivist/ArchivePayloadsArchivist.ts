import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { PayloadArchivist } from './PayloadArchivist'

export interface ArchivePayloadsId {
  archive: string
  hash: string
}

export type ArchivePayloadsArchivist = PayloadArchivist<XyoPayloadWithMeta, ArchivePayloadsId>
