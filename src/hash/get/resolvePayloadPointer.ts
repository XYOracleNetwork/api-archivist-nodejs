import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { findPayload } from '../../lib'
import { PayloadPointer } from './PayloadPointer'
import { combineRules } from './PayloadRules'

export const resolvePayloadPointer = (payload: XyoPayload<PayloadPointer>): Promise<XyoPayload | undefined> => {
  const { archive, direction, schema, timestamp } = combineRules(payload.reference)
  return findPayload(archive, timestamp, direction, schema)
}
