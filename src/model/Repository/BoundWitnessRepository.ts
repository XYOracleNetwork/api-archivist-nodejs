import { XyoBoundWitness, XyoBoundWitnessBody } from '@xyo-network/sdk-xyo-client-js'

import { Repository } from './Repository'

export type BoundWitnessRepository<TInsert extends XyoBoundWitnessBody, TResponse extends XyoBoundWitness, TId = string, TQuery = unknown> = Repository<
  TInsert[],
  TResponse[],
  TId,
  TQuery
>
