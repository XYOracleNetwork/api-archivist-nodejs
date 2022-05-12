import { XyoPayload, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'

import { ReadWriteRepository } from './Repository'

export type PayloadRepository<TInsert extends XyoPayloadBody, TResponse extends XyoPayload, TQuery, TId = string> = ReadWriteRepository<TInsert[], TResponse[], TQuery, TId>
