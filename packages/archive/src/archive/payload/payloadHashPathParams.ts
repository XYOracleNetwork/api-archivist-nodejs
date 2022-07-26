import { ArchivePathParams } from '@xyo-network/archivist-model'

export type PayloadHashPathParams = ArchivePathParams & {
  hash: string
}
