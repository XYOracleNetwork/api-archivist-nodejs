import 'reflect-metadata'

import { NullablePromisableArray, PromisableArray } from '@xyo-network/promisable'
import { EmptyObject, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { injectable } from 'inversify'

import { PayloadArchivist } from './PayloadArchivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

@injectable()
export abstract class AbstractPayloadArchivist<T extends EmptyObject = EmptyObject, TId = string> implements PayloadArchivist<T, TId> {
  abstract find(filter: XyoPayloadFilterPredicate<T>): PromisableArray<XyoPayloadWithMeta<T>>
  abstract get(id: TId[]): NullablePromisableArray<XyoPayloadWithMeta<T>>
  abstract insert(items: T[]): PromisableArray<XyoPayloadWithMeta<T>>
}
