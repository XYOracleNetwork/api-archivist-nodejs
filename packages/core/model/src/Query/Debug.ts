import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/payload'

import { Query } from './Query'

export type DebugSchema = 'network.xyo.debug'
export const DebugSchema: DebugSchema = 'network.xyo.debug'

export interface Debug {
  delay?: number
  nonce?: string
  schema: DebugSchema
}

export type DebugPayload = XyoPayload<Debug>
export type DebugPayloadWithMeta = XyoPayloadWithMeta<Debug>

export class DebugQuery extends Query<DebugPayload> {}
