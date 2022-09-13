import { XyoBoundWitness, XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'
import { Archivist, XyoArchivistQuery } from '@xyo-network/sdk-xyo-client-js'

import { XyoBoundWitnessFilterPredicate } from './XyoBoundWitnessFilterPredicate'

export type BoundWitnessArchivist = Archivist<
  XyoBoundWitnessWithMeta | null,
  XyoBoundWitness | null,
  XyoBoundWitness,
  XyoBoundWitnessWithMeta | null,
  XyoBoundWitnessFilterPredicate,
  string,
  XyoArchivistQuery
>
