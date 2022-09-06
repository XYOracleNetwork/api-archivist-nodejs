import 'reflect-metadata'

import { NullablePromisableArray, PromisableArray } from '@xyo-network/promisable'
import { XyoBoundWitness, XyoBoundWitnessWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { injectable } from 'inversify'

import { BoundWitnessArchivist } from './BoundWitnessArchivist'
import { XyoBoundWitnessFilterPredicate } from './XyoBoundWitnessFilterPredicate'

@injectable()
export abstract class AbstractBoundWitnessArchivist<TId> implements BoundWitnessArchivist<TId> {
  abstract find(query: XyoBoundWitnessFilterPredicate): PromisableArray<XyoBoundWitnessWithMeta>
  abstract get(id: TId[]): NullablePromisableArray<XyoBoundWitnessWithMeta>
  abstract insert(item: XyoBoundWitness[]): PromisableArray<XyoBoundWitnessWithMeta>
}
