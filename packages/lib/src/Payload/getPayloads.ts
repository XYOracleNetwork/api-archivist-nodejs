import { SortDirection } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistPayloadMongoSdk } from '../dbSdk'

const defaultLimit = 10

// TODO: Refactor to inject payload repository
export const getPayloads = (archive: string, timestamp?: number, limit = defaultLimit, sortOrder: SortDirection = 'desc', schema?: string): Promise<XyoPayload[] | null> => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  // If no hash/timestamp was supplied, just return from the start/end of the archive
  if (!timestamp) timestamp = sortOrder === 'desc' ? Date.now() : 0
  return sdk.findSorted(timestamp, limit, sortOrder, schema)
}
