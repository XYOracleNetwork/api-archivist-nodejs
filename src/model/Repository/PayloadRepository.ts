import { XyoPayload, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'

import { Repository } from './Repository'

export type PayloadRepository<
  TWriteResponse extends XyoPayload,
  TWrite extends XyoPayloadBody,
  TReadResponse = TWriteResponse,
  TId = string,
  TQueryResponse = unknown,
  TQuery = unknown
> = Repository<TWriteResponse[], TWrite[], TReadResponse[], TId, TQueryResponse, TQuery>
