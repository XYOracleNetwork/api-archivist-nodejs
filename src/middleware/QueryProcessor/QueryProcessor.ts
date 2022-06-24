import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Optional, Query } from '../../model'

export type QueryProcessor<T extends Query = Query, R extends Optional<XyoPayload> = Optional<XyoPayload>> = (x: T) => Promise<R>
