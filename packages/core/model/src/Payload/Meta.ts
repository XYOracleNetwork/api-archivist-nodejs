import { EmptyObject } from '@xyo-network/core'
import { XyoPayload } from '@xyo-network/payload'

export interface XyoPayloadMetaBase {
  _archive?: string
  _client?: string
  _hash: string
  _observeDuration?: number
  _reportedHash?: string
  _schemaValid?: boolean
  _sources?: XyoPayload[]
  _timestamp: number
  _user_agent?: string
}

export type XyoPayloadMeta<T extends EmptyObject = EmptyObject> = T & XyoPayloadMetaBase
export type XyoPartialPayloadMeta<T extends EmptyObject = EmptyObject> = T & Partial<XyoPayloadMetaBase>
export type XyoPayloadWithMeta<T extends EmptyObject = EmptyObject> = XyoPayload<T & XyoPayloadMetaBase>
export type XyoPayloadWithPartialMeta<T extends EmptyObject = EmptyObject> = XyoPayload<T & Partial<XyoPayloadMetaBase>>
