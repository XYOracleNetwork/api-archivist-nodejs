import { EmptyObject, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { _Archivist } from './Archivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

export type PayloadArchivist<
  T extends EmptyObject,
  TId = string,
  TQueryResponse = XyoPayloadWithMeta<T>[],
  TQuery = XyoPayloadFilterPredicate<T>,
> = _Archivist<XyoPayloadWithMeta<T>[], T[], XyoPayloadWithMeta<T>[], TId, TQueryResponse, TQuery>
