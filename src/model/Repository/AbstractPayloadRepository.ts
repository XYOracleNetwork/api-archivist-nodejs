import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { PayloadRepository } from './PayloadRepository'

export abstract class AbstractPayloadRepository<T, TId = string, TQueryResponse = unknown, TQuery = unknown> implements PayloadRepository<T, TId, TQueryResponse, TQuery> {
  abstract find(filter: TQuery): Promise<TQueryResponse>
  abstract get(id: TId): Promise<XyoPayload<T>[]>
  abstract insert(items: T[]): Promise<XyoPayload<T>[]>
}
