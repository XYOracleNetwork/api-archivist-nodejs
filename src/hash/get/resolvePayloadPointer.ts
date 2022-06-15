import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { getPayloads } from '../../lib'
import { PayloadPointer } from './PayloadPointer'

export const resolvePayloadPointer = async (payload: XyoPayload<PayloadPointer>): Promise<XyoPayload | undefined> => {
  const { archive, schema, timestamp } = payload.reference
  // TODO: Sort order, etc.
  const payloads = await getPayloads(archive, timestamp, 1, 'desc', schema)
  return payloads ? payloads[0] : undefined
}
