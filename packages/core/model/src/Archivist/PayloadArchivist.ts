import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { Archivist } from './Archivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

export type PayloadArchivist<T extends object, TId = string, TQuery = XyoPayloadFilterPredicate<Partial<T>>> = Archivist<
  XyoPayloadWithMeta<T>[],
  T[],
  XyoPayloadWithMeta<T>[],
  TId,
  XyoPayloadWithMeta<T>[],
  TQuery
>
