import { ArchivePathParams } from '../../../../model'

export type PayloadChainPathParams = ArchivePathParams & {
  hash: string
  limit?: string
}
