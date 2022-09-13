import { XyoQuery } from '@xyo-network/module'
import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/payload'

export type XyoQueryPayloadWithMeta<T extends XyoPayload = XyoPayload> = XyoPayloadWithMeta<XyoQuery<T & { _queryId?: string }>>
