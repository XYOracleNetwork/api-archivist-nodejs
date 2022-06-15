import { XyoPayload, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'

export const payloadPointerSchema = 'network.xyo.payload.pointer'
export type PayloadPointerSchema = typeof payloadPointerSchema

export interface PayloadPointer {
  reference: {
    archive: string
    schema: string
    timestamp?: number
  }
}

export type PayloadPointerBody = PayloadPointer & XyoPayloadBody
export type PayloadPointerPayload = XyoPayload<PayloadPointerBody>
