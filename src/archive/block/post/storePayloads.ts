import 'source-map-support/register'

import { assertEx } from '@xylabs/sdk-js'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistPayloadMongoSdk } from '../../../lib'

export const storePayloads = async (archive: string, payloads: XyoPayload[]) => {
  if (payloads.length > 0) {
    const sdk = await getArchivistPayloadMongoSdk(archive)
    const payloadsResult = await sdk.insertMany(assertEx(payloads))
    assertEx(payloadsResult === payloads.length, `Payload Storage Failed [${payloadsResult}/${payloads.length}]`)
  }
}
