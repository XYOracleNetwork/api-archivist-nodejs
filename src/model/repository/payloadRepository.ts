import { XyoPayload, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'

import { ReadWriteRepository } from './repository'

export type PayloadRepository<T extends XyoPayloadBody, TQuery> = ReadWriteRepository<T[], XyoPayload[], TQuery, string>
