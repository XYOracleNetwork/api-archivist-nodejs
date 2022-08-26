import 'reflect-metadata'

import { EmptyObject, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { injectable } from 'inversify'

import { PayloadArchivist } from './PayloadArchivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

@injectable()
abstract class AbstractPayloadArchivist<T extends EmptyObject = EmptyObject, TId = string> implements PayloadArchivist<T, TId> {
  abstract find(filter: XyoPayloadFilterPredicate<T>): Promise<XyoPayloadWithMeta<T>[]>
  abstract get(id: TId): Promise<XyoPayloadWithMeta<T>[]>
  abstract insert(items: T[]): Promise<XyoPayloadWithMeta<T>[]>
}

export { AbstractPayloadArchivist }
