import { ArchivePathParams } from '@xyo-network/archivist-model'

export type PayloadChainPathParams = ArchivePathParams & {
  hash: string
  limit?: string
}
