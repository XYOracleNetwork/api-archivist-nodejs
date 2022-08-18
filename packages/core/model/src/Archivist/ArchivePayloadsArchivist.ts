import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { PayloadArchivist } from './PayloadArchivist'
import { XyoArchivePayloadFilterPredicate } from './XyoPayloadFilterPredicate'

export interface ArchivePayloadsArchivistId {
  archive: string
  hash: string
}

export type ArchivePayloadsArchivist = PayloadArchivist<
  XyoPayloadWithMeta,
  ArchivePayloadsArchivistId,
  XyoArchivePayloadFilterPredicate<Partial<XyoPayloadWithMeta>>
>
