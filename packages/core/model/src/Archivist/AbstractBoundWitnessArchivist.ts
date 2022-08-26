import 'reflect-metadata'

import { EmptyObject, XyoBoundWitness, XyoBoundWitnessWithMeta, XyoPayloadWithPartialMeta } from '@xyo-network/sdk-xyo-client-js'
import { injectable } from 'inversify'

import { BoundWitnessArchivist } from './BoundWitnessArchivist'
import { XyoBoundWitnessFilterPredicate } from './XyoBoundWitnessFilterPredicate'

@injectable()
abstract class AbstractBoundWitnessArchivist<TId> implements BoundWitnessArchivist<TId> {
  abstract find(query: XyoBoundWitnessFilterPredicate): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]>
  abstract get(id: TId): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]>
  abstract insert(item: XyoBoundWitness[]): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]>
}

export { AbstractBoundWitnessArchivist }
