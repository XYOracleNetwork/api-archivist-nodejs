import { ArchivePathParams } from '../../archivePathParams'

export type BlockHashPathParams = ArchivePathParams & {
  hash: string
}
