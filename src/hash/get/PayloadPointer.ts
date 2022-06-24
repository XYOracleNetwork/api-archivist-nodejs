import { XyoPayload, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'

import { PayloadRule } from './PayloadRules'

export const payloadPointerSchema = 'network.xyo.payload.pointer'
export type PayloadPointerSchema = typeof payloadPointerSchema

export interface PayloadPointer {
  reference: PayloadRule[][]
}

export type PayloadPointerBody = PayloadPointer & XyoPayloadBody
export type PayloadPointerPayload = XyoPayload<PayloadPointerBody>
