import 'source-map-support/register'

import { assertEx } from '@xylabs/sdk-js'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistPayloadMongoSdk } from '../../../lib'

export const storePayloads = async (archive: string, payloads: XyoPayload[]) => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  return await sdk.insertMany(assertEx(payloads))
}
