import { XyoBoundWitness, XyoBoundWitnessWithMeta, XyoPayloadFindFilter } from '@xyo-network/sdk-xyo-client-js'

import { BoundWitnessArchivist } from './BoundWitnessArchivist'

export abstract class AbstractBoundWitnessArchivist<T extends object, TId = string> implements BoundWitnessArchivist<TId> {
  abstract find(filter: XyoPayloadFindFilter): Promise<XyoBoundWitnessWithMeta<T>[]>
  abstract get(id: TId): Promise<XyoBoundWitnessWithMeta<T>[]>
  abstract insert(items: XyoBoundWitness[]): Promise<XyoBoundWitnessWithMeta<T>[]>
}
