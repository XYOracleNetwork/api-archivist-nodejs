import { assertEx } from '@xylabs/sdk-js'

import { getArchiveOwnerMongoSdk } from '../../lib'

export const storeArchiveOwner = async (archive: string, user: string): Promise<void> => {
  const sdk = await getArchiveOwnerMongoSdk()
  const result = await sdk.insert({ archive, user })
  assertEx(result !== null, 'Claim Archive Failed')
  return
}
