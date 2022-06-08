import { delay } from '@xylabs/sdk-js'
import { XyoPayload, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'

import { DebugQuery, debugSchema, QueryHandler } from '../model'

export class DebugQueryHandler implements QueryHandler<DebugQuery, XyoPayload> {
  async handle(query: DebugQuery) {
    const ms = query?.payload?.delay || 1
    await delay(ms)
    return new XyoPayloadBuilder({ schema: debugSchema }).fields(query.payload).build()
  }
}
