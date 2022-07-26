import { Optional, Query } from '@xyo-network/archivist-model'
import { XyoPayload, XyoPayloadWithPartialMeta } from '@xyo-network/sdk-xyo-client-js'

export type QueryProcessor<T extends Query = Query, R extends XyoPayload = XyoPayload> = (payload: T) => Promise<Optional<XyoPayloadWithPartialMeta<R>>>
