import { XyoArchiveKey } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistArchiveKeysMongoSdk } from '../dbSdk'

export const getArchiveKeys = async (archive: string): Promise<XyoArchiveKey[]> => {
  const sdk = getArchivistArchiveKeysMongoSdk()
  const archiveKeys = await sdk.findByArchive(archive)
  return archiveKeys.map<XyoArchiveKey>((archiveKey) => {
    return { archive, created: archiveKey._id.getTimestamp().getTime(), key: archiveKey.key }
  })
}
