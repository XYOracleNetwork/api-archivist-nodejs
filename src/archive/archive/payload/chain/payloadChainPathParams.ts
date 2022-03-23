import { ArchivePathParams } from '../../../../model'

export type PayloadChainPathParams = ArchivePathParams & {
  limit?: string
  hash: string
}
