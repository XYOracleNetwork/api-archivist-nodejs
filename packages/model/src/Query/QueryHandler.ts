import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Handler } from '../Domain'
import { Optional } from '../Optional'
import { Query } from './Query'

export interface QueryHandler<T extends Query, R extends XyoPayload = XyoPayload> extends Handler<T, Optional<R>> {
  handle(query: T): Promise<Optional<R>>
}