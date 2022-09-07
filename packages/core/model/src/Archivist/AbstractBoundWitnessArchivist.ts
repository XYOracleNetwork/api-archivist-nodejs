import 'reflect-metadata'

import { XyoBoundWitness, XyoBoundWitnessWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { injectable } from 'inversify'

import { BoundWitnessArchivist } from './BoundWitnessArchivist'
import { XyoBoundWitnessFilterPredicate } from './XyoBoundWitnessFilterPredicate'

@injectable()
export abstract class AbstractBoundWitnessArchivist<TId> implements BoundWitnessArchivist<TId> {
  abstract find(query: XyoBoundWitnessFilterPredicate): Promise<XyoBoundWitnessWithMeta[]>
  abstract get(id: TId[]): Promise<Array<XyoBoundWitnessWithMeta | null>>
  abstract insert(item: XyoBoundWitness[]): Promise<XyoBoundWitnessWithMeta[]>
}
