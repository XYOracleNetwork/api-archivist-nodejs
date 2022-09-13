import { Archivist, XyoArchivistQuery } from '@xyo-network/archivist'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { EmptyObject } from '@xyo-network/core'
import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/payload'

import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

export type PayloadArchivist<T extends EmptyObject = EmptyObject, TId = string> = Archivist<
  XyoPayloadWithMeta<T> | null,
  XyoBoundWitness | null,
  XyoPayload<T>,
  XyoPayloadWithMeta<T> | null,
  XyoPayloadFilterPredicate<T>,
  TId,
  XyoArchivistQuery
>
