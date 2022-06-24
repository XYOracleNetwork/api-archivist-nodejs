import { ArchivePathParams } from '../../../../model'

export type BlockChainPathParams = ArchivePathParams & {
  address: string
  hash: string
  limit?: string
}
