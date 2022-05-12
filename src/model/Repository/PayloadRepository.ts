import { XyoPayload, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'

import { Repository } from './Repository'

export type PayloadRepository<TInsert extends XyoPayloadBody, TResponse extends XyoPayload, TId = string, TQuery = unknown> = Repository<TInsert[], TResponse[], TId, TQuery>
