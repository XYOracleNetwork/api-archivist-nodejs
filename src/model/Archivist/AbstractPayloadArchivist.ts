import 'reflect-metadata'

import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { injectable } from 'inversify'

import { PayloadArchivist } from './PayloadArchivist'

@injectable()
export abstract class AbstractPayloadArchivist<T extends object, TId = string, TQuery = unknown> implements PayloadArchivist<T, TId, TQuery> {
  abstract find(filter: TQuery): Promise<XyoPayloadWithMeta<T>[]>
  abstract get(id: TId): Promise<XyoPayloadWithMeta<T>[]>
  abstract insert(items: T[]): Promise<XyoPayloadWithMeta<T>[]>
}
