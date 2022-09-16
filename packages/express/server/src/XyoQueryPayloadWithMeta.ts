import { XyoPayloadWithMeta } from '@xyo-network/archivist-model'
import { XyoQuery } from '@xyo-network/module'
import { XyoPayload } from '@xyo-network/payload'

export type XyoQueryPayloadWithMeta<T extends XyoPayload = XyoPayload> = XyoPayloadWithMeta<XyoQuery<T & { _queryId?: string }>>
