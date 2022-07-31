import { ArchivePathParams } from '@xyo-network/archivist-model'

export type BlockHashPathParams = ArchivePathParams & {
  hash: string
}
