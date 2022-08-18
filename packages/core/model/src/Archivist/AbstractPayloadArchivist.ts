import 'reflect-metadata'

import { XyoPayloadFindFilter, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { injectable } from 'inversify'

import { PayloadArchivist } from './PayloadArchivist'

@injectable()
export abstract class AbstractPayloadArchivist<T extends object, TId = string> implements PayloadArchivist<T, TId> {
  abstract find(filter: XyoPayloadFindFilter): Promise<XyoPayloadWithMeta<T>[]>
  abstract get(id: TId): Promise<XyoPayloadWithMeta<T>[]>
  abstract insert(items: T[]): Promise<XyoPayloadWithMeta<T>[]>
}
