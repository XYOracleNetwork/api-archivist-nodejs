import { XyoQueryPayload } from '@xyo-network/module'
import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/payload'

export type XyoQueryPayloadWithMeta<T extends XyoPayload = XyoPayload> = XyoPayloadWithMeta<XyoQueryPayload<T & { _queryId?: string }>>
