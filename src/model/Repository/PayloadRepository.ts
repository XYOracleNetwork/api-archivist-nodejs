import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { Archivist } from './Repository'

export type PayloadArchivist<T extends object, TId = string, TQuery = unknown> = Archivist<
  XyoPayloadWithMeta<T>[],
  T[],
  XyoPayloadWithMeta<T>[],
  TId,
  XyoPayloadWithMeta<T>[],
  TQuery
>
