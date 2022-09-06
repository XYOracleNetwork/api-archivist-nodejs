import { Archivist, EmptyObject, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

export type PayloadArchivist<
  T extends EmptyObject,
  TId = string,
  TQueryResponse = XyoPayloadWithMeta<T>,
  TQuery = XyoPayloadFilterPredicate<T>,
> = Archivist<XyoPayloadWithMeta<T>, XyoPayloadWithMeta<T>, T, TQueryResponse, TQuery, TId>
