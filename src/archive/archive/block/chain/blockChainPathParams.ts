import { ArchivePathParams } from '../../../../model'

export type BlockChainPathParams = ArchivePathParams & {
  limit?: string
  hash: string
  address: string
}
