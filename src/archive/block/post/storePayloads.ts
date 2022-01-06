import 'source-map-support/register'

import { assertEx } from '@xylabs/sdk-js'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistPayloadMongoSdk } from '../../../lib'

export const storePayloads = async (archive: string, payloads: XyoPayload[]): Promise<number> => {
  let result = 0
  if (payloads.length > 0) {
    const sdk = await getArchivistPayloadMongoSdk(archive)
    result = await sdk.insertMany(assertEx(payloads))
    assertEx(result === payloads.length, `Payload Storage Failed [${result}/${payloads.length}]`)
  }
  return result
}
