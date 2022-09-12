import 'reflect-metadata'

import { EmptyObject } from '@xyo-network/core'
import { XyoPayloadWithMeta } from '@xyo-network/payload'
import { injectable } from 'inversify'

import { PayloadArchivist } from './PayloadArchivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

@injectable()
export abstract class AbstractPayloadArchivist<T extends EmptyObject = EmptyObject, TId = string> implements PayloadArchivist<T, TId> {
  abstract find(filter: XyoPayloadFilterPredicate<T>): Promise<XyoPayloadWithMeta<T>[]>
  abstract get(id: TId[]): Promise<Array<XyoPayloadWithMeta<T> | null>>
  abstract insert(items: T[]): Promise<XyoPayloadWithMeta<T>[]>
}
