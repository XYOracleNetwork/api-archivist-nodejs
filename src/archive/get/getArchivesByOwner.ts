import { assertEx } from '@xylabs/sdk-js'

import { getArchiveOwnerMongoSdk } from '../../lib'

export const getArchivesByOwner = async (user: string): Promise<void> => {
  const sdk = await getArchiveOwnerMongoSdk()
  const result = await sdk.findByUser(user)
  assertEx(result !== null, 'Archive Claim Failed')
  return
}
