import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { PayloadArchivist } from './PayloadArchivist'

export interface ArchivePayloadsArchivistId {
  archive: string
  hash: string
}

export type ArchivePayloadsArchivist<T extends { schema: string } = { schema: string }> = PayloadArchivist<
  T,
  ArchivePayloadsArchivistId,
  XyoPayloadWithMeta<T>[],
  Partial<XyoPayloadWithMeta<T>>
>
