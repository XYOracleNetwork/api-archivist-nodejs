import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Repository } from './Repository'

export type PayloadRepository<T, TId = string, TQuery = unknown> = Repository<XyoPayload<T>[], T[], XyoPayload<T>[], TId, XyoPayload<T>[], TQuery>
