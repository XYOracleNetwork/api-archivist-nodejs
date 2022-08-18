import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { PayloadArchivist } from './PayloadArchivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

export type BoundWitnessArchivist<TId = string, TQuery = XyoPayloadFilterPredicate<Partial<XyoBoundWitness>>> = PayloadArchivist<
  XyoBoundWitness,
  TId,
  XyoBoundWitness[],
  TQuery
>
