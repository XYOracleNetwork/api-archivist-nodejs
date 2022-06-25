import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { PayloadRepository } from './PayloadRepository'

export abstract class AbstractPayloadRepository<T extends object, TId = string, TQuery = unknown> implements PayloadRepository<T, TId, TQuery> {
  abstract find(filter: TQuery): Promise<XyoPayloadWithMeta<T>[]>
  abstract get(id: TId): Promise<XyoPayloadWithMeta<T>[]>
  abstract insert(items: T[]): Promise<XyoPayloadWithMeta<T>[]>
}
