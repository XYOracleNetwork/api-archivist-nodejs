import { XyoPayload, XyoPayloadWithMeta, XyoQueryPayload } from '@xyo-network/sdk-xyo-client-js'

export type XyoQueryPayloadWithMeta<T extends XyoPayload = XyoPayload> = XyoPayloadWithMeta<XyoQueryPayload<T & { _queryId?: string }>>
