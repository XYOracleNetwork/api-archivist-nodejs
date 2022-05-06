import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistArchiveMongoSdk } from './dbSdk'
import { determineArchiveAccessControl } from './determineArchiveAccessControl'

export const getArchiveByName = async (name: string | undefined): Promise<XyoArchive | null> => {
  if (!name) {
    return null
  }
  const sdk = getArchivistArchiveMongoSdk()
  const record = await sdk.findByArchive(name?.toLowerCase?.())
  if (!record) return null
  const { archive, user } = record
  const accessControl = determineArchiveAccessControl(record)
  return { accessControl, archive, user }
}
