import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistArchiveMongoSdk } from './dbSdk'
import { determineArchiveAccessControl } from './determineArchiveAccessControl'

export const getArchivesByOwner = async (user: string): Promise<XyoArchive[]> => {
  const sdk = await getArchivistArchiveMongoSdk()
  const response = await sdk.findByUser(user)
  return response.map((record) => {
    const { archive, user } = record
    const accessControl = determineArchiveAccessControl(record)
    return { accessControl, archive, user }
  })
}
