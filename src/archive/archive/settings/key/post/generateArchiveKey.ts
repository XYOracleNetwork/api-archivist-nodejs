import { XyoArchiveKey } from '@xyo-network/sdk-xyo-client-js'
import { v4 } from 'uuid'

import { getArchivistArchiveKeysMongoSdk } from '../../../../../lib'

export const generateArchiveKey = async (archive: string): Promise<XyoArchiveKey> => {
  const sdk = await getArchivistArchiveKeysMongoSdk()
  const key = v4()
  const result = await sdk.insert({ archive, key })
  return { archive, created: result.getTimestamp().getTime(), key }
}
