import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { BoundWitnessRepository } from './BoundWitnessRepository'

// TODO: Move type to SDK
export type XyoBoundWitnessFull<T> = XyoBoundWitness & T

export abstract class AbstractBoundWitnessRepository<T, TId = string, TQuery = unknown> implements BoundWitnessRepository<TId, TQuery> {
  abstract find(filter: TQuery): Promise<XyoBoundWitnessFull<T>[]>
  abstract get(id: TId): Promise<XyoBoundWitnessFull<T>[]>
  abstract insert(items: XyoBoundWitness[]): Promise<XyoBoundWitnessFull<T>[]>
}
