import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Query } from './Query'

export const debugSchema = 'network.xyo.debug'
export type DebugSchema = typeof debugSchema

export interface Debug {
  delay?: number
  schema: DebugSchema
}

export type DebugPayload = XyoPayload<Debug>

export class DebugQuery extends Query<DebugPayload> {}
