import { XyoBoundWitness, XyoBoundWitnessWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { BoundWitnessRepository } from './BoundWitnessRepository'

export abstract class AbstractBoundWitnessRepository<T extends object, TId = string, TQuery = unknown> implements BoundWitnessRepository<TId, TQuery> {
  abstract find(filter: TQuery): Promise<XyoBoundWitnessWithMeta<T>[]>
  abstract get(id: TId): Promise<XyoBoundWitnessWithMeta<T>[]>
  abstract insert(items: XyoBoundWitness[]): Promise<XyoBoundWitnessWithMeta<T>[]>
}
