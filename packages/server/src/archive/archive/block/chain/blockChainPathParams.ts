import { ArchivePathParams } from '@xyo-network/archivist-model'

export type BlockChainPathParams = ArchivePathParams & {
  address: string
  hash: string
  limit?: string
}
