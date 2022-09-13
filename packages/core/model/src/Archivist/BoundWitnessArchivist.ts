import { Archivist, XyoArchivistQuery } from '@xyo-network/archivist'
import { XyoBoundWitness, XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'

import { XyoBoundWitnessFilterPredicate } from './XyoBoundWitnessFilterPredicate'

export type BoundWitnessArchivist<TId = string> = Archivist<
  XyoBoundWitnessWithMeta | null,
  XyoBoundWitness | null,
  XyoBoundWitness,
  XyoBoundWitnessWithMeta | null,
  XyoBoundWitnessFilterPredicate,
  TId,
  XyoArchivistQuery
>
