import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { ArchiveRepository } from '../middleware'
import { getArchivistArchiveMongoSdk } from './dbSdk'
import { determineArchiveAccessControl } from './determineArchiveAccessControl'

/** @deprecated use req.app.archiveRepository instead */
export const _getArchivesByOwner = async (user: string): Promise<XyoArchive[]> => {
  const sdk = getArchivistArchiveMongoSdk()
  const response = await sdk.findByUser(user)
  return response.map((record) => {
    const { archive, user } = record
    const accessControl = determineArchiveAccessControl(record)
    return { accessControl, archive, user }
  })
}

export const getArchivesByOwner = (archives: ArchiveRepository, user: string): Promise<XyoArchive[]> => {
  throw new Error('TODO')
}
