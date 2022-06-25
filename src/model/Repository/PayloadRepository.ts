import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { Repository } from './Repository'

export type PayloadRepository<T extends object, TId = string, TQuery = unknown> = Repository<
  XyoPayloadWithMeta<T>[],
  T[],
  XyoPayloadWithMeta<T>[],
  TId,
  XyoPayloadWithMeta<T>[],
  TQuery
>
