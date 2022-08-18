import { XyoPayloadFindFilter, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { Archivist } from './Archivist'

export type PayloadArchivist<T extends object, TId = string> = Archivist<
  XyoPayloadWithMeta<T>[],
  T[],
  XyoPayloadWithMeta<T>[],
  TId,
  XyoPayloadWithMeta<T>[],
  XyoPayloadFindFilter
>
