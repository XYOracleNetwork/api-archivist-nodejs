import 'source-map-support/register'

import { assertEx } from '@xylabs/sdk-js'
import { getArchivistPayloadMongoSdk } from '@xyo-network/archivist-lib'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

export const storePayloads = async (archive: string, payloads: XyoPayload[]) => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  return await sdk.insertMany(assertEx(payloads))
}
