import { XyoPayload, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'

import { Repository } from './Repository'

export type PayloadRepository<TInsert extends XyoPayloadBody, TResponse extends XyoPayload, TQuery, TId = string> = Repository<TInsert[], TResponse[], TQuery, TId>
