import { XyoPayload, XyoPayloadWithPartialMeta } from '@xyo-network/sdk-xyo-client-js'

import { Optional, Query } from '../../model'

export type QueryProcessor<T extends Query = Query, R extends XyoPayload = XyoPayload> = (payload: T) => Promise<Optional<XyoPayloadWithPartialMeta<R>>>
