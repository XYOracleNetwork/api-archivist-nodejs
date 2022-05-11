import { WithXyoPayloadMeta, XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { ReadWriteRepository } from './repository'

export type PayloadRepository<T extends XyoPayload, TQuery> = ReadWriteRepository<WithXyoPayloadMeta<T>[], TQuery, string>
