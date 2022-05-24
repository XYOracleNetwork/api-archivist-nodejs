import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { PayloadRepository } from './PayloadRepository'

export abstract class AbstractPayloadRepository<T, TId = string, TQuery = unknown> implements PayloadRepository<T, TId, TQuery> {
  abstract find(filter: TQuery): Promise<XyoPayload<T>[]>
  abstract get(id: TId): Promise<XyoPayload<T>[]>
  abstract insert(items: T[]): Promise<XyoPayload<T>[]>
}
