import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { BoundWitnessRepository } from './BoundWitnessRepository'

export abstract class AbstractBoundWitnessRepository<T, TId = string, TQueryResponse = unknown, TQuery = unknown> implements BoundWitnessRepository<TId, TQueryResponse, TQuery> {
  abstract find(filter: TQuery): Promise<TQueryResponse>
  abstract get(id: TId): Promise<(XyoBoundWitness & T)[]>
  abstract insert(items: XyoBoundWitness[]): Promise<(XyoBoundWitness & T)[]>
}
