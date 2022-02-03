import { v4 } from 'uuid'

import { getArchiveKeysMongoSdk } from '../../../../lib'

export interface IStoreArchiveKeyResponse {
  archive: string
  created: string
  key: string
}

export const generateArchiveKey = async (archive: string): Promise<IStoreArchiveKeyResponse> => {
  const sdk = await getArchiveKeysMongoSdk()
  const key = v4()
  const result = await sdk.insert({ archive, key })
  return { archive, created: result.getTimestamp().toISOString(), key }
}
