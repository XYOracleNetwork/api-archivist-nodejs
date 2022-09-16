import { Archivist, XyoArchivistQuery } from '@xyo-network/archivist'
import { XyoBoundWitness } from '@xyo-network/boundwitness'

import { XyoBoundWitnessWithMeta } from '../..'
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
