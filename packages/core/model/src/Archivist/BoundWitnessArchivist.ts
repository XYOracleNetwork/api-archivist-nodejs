import { XyoBoundWitness, XyoBoundWitnessWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { _Archivist } from './Archivist'
import { XyoBoundWitnessFilterPredicate } from './XyoBoundWitnessFilterPredicate'

export type BoundWitnessArchivist<TId = string, TQuery extends XyoBoundWitnessFilterPredicate = XyoBoundWitnessFilterPredicate> = _Archivist<
  XyoBoundWitnessWithMeta[],
  XyoBoundWitness[],
  XyoBoundWitnessWithMeta[],
  TId,
  XyoBoundWitnessWithMeta[],
  TQuery
>
