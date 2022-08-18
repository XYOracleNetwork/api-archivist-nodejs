import 'reflect-metadata'

import { XyoBoundWitness, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { injectable } from 'inversify'

import { BoundWitnessArchivist } from './BoundWitnessArchivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

@injectable()
export abstract class AbstractBoundWitnessArchivist<TId = string> implements BoundWitnessArchivist<TId> {
  abstract find(query: XyoPayloadFilterPredicate<Partial<XyoBoundWitness>>): Promise<XyoBoundWitness[]>
  abstract get(id: TId): Promise<XyoPayloadWithMeta<XyoBoundWitness>[]>
  abstract insert(item: XyoBoundWitness[]): Promise<XyoPayloadWithMeta<XyoBoundWitness>[]>
}
