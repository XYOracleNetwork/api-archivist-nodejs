import { XyoPayload, XyoPayloadWithPartialMeta } from '@xyo-network/payload'

import { Optional } from '../Optional'
import { Query } from './Query'

export type QueryProcessor<T extends Query = Query, R extends XyoPayload = XyoPayload> = (
  payload: T,
) => Promise<Optional<XyoPayloadWithPartialMeta<R>>>
