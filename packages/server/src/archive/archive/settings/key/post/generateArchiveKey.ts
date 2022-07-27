import { getArchivistArchiveKeysMongoSdk } from '@xyo-network/archivist-lib'
import { XyoArchiveKey } from '@xyo-network/sdk-xyo-client-js'
import { v4 } from 'uuid'

export const generateArchiveKey = async (archive: string): Promise<XyoArchiveKey> => {
  const sdk = getArchivistArchiveKeysMongoSdk()
  const key = v4()
  const result = await sdk.insert({ archive, key })
  return { archive, created: result.getTimestamp().getTime(), key }
}
