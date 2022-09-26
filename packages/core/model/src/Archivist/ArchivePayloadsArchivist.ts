import { PayloadArchivist } from './PayloadArchivist'

export interface ArchivePayloadsArchivistId {
  archive: string
  hash: string
}

export type ArchivePayloadsArchivist<T extends { schema: string } = { schema: string }> = PayloadArchivist<T, ArchivePayloadsArchivistId>
