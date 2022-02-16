import { v4 } from 'uuid'

import { getArchivistArchiveKeysMongoSdk } from '../../../../lib'

export interface IGenerateArchiveKeyResult {
  archive: string
  created: string
  key: string
}

export const generateArchiveKey = async (archive: string): Promise<IGenerateArchiveKeyResult> => {
  const sdk = await getArchivistArchiveKeysMongoSdk()
  const key = v4()
  const result = await sdk.insert({ archive, key })
  return { archive, created: result.getTimestamp().toISOString(), key }
}
