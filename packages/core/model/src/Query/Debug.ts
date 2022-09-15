import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/payload'

import { Query } from './Query'

export const debugSchema = 'network.xyo.debug'
export type DebugSchema = typeof debugSchema

export interface Debug {
  delay?: number
  nonce?: string
  schema: DebugSchema
}

export type DebugPayload = XyoPayload<Debug>
export type DebugPayloadWithMeta = XyoPayloadWithMeta<Debug>

export class DebugQuery extends Query<DebugPayload> {}
