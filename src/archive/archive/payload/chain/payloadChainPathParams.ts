import { ArchivePathParams } from '../../../archivePathParams'

export type PayloadChainPathParams = ArchivePathParams & {
  limit?: string
  hash: string
}
