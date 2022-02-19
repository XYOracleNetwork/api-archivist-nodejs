import { ArchivePathParams } from '../../../archivePathParams'

export type BlockChainPathParams = ArchivePathParams & {
  limit?: string
  hash: string
  address: string
}
