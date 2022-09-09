import { XyoPayloadWithMeta } from '@xyo-network/payload'

import { PayloadArchivist } from './PayloadArchivist'
import { XyoArchivePayloadFilterPredicate } from './XyoPayloadFilterPredicate'

export interface ArchivePayloadsArchivistId {
  archive: string
  hash: string
}

export type ArchivePayloadsArchivist<T extends { schema: string } = { schema: string }> = PayloadArchivist<
  T,
  ArchivePayloadsArchivistId,
  XyoPayloadWithMeta<T>,
  // Partial<XyoPayloadWithMeta<T>>,
  XyoArchivePayloadFilterPredicate<T>
>
