import { XyoPayload, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'

import { ReadWriteRepository } from './repository'

export type PayloadRepository<TInsert extends XyoPayloadBody, TResponse extends XyoPayload, TQuery, TId = string> = ReadWriteRepository<TInsert[], TResponse[], TQuery, TId>
