import 'reflect-metadata'

import { EmptyObject, XyoBoundWitness, XyoBoundWitnessWithMeta, XyoPayloadWithPartialMeta } from '@xyo-network/sdk-xyo-client-js'
import { injectable } from 'inversify'

import { BoundWitnessArchivist } from './BoundWitnessArchivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

@injectable()
export abstract class AbstractBoundWitnessArchivist<TId> implements BoundWitnessArchivist<TId> {
  abstract find(
    query: XyoPayloadFilterPredicate<Partial<{ hash: string; schema: string }>>,
  ): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]>
  abstract get(id: TId): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]>
  abstract insert(item: XyoBoundWitness[]): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]>
}
