import { XyoPayload, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'

import { PayloadRepository } from './PayloadRepository'

// export abstract class AbstractPayloadRepository<TInsert, TResponse extends XyoStoredPayload<TInsert>, TId, TQuery> implements PayloadRepository<> {
export abstract class AbstractPayloadRepository<
  TWriteResponse extends XyoPayload,
  TWrite extends XyoPayloadBody,
  TReadResponse = TWriteResponse,
  TId = string,
  TQueryResponse = unknown,
  TQuery = unknown
> implements PayloadRepository<TWriteResponse, TWrite, TReadResponse, TId, TQueryResponse, TQuery>
{
  abstract find(filter: TQuery): Promise<TQueryResponse>
  abstract get(id: TId): Promise<TReadResponse[]>
  abstract insert(items: TWrite[]): Promise<TWriteResponse[]>
}
