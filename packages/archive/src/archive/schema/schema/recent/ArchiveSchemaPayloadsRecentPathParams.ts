import { ArchivePathParams } from '@xyo-network/archivist-model'

export type ArchiveSchemaPayloadsRecentPathParams = ArchivePathParams & {
  limit?: string
  schema: string
}
