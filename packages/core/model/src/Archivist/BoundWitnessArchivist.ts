import { Archivist, XyoBoundWitness, XyoBoundWitnessWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { XyoBoundWitnessFilterPredicate } from './XyoBoundWitnessFilterPredicate'

export type BoundWitnessArchivist<TId = string, TQuery extends XyoBoundWitnessFilterPredicate = XyoBoundWitnessFilterPredicate> = Archivist<
  XyoBoundWitnessWithMeta,
  XyoBoundWitnessWithMeta,
  XyoBoundWitness,
  XyoBoundWitnessWithMeta,
  TQuery,
  TId
>
