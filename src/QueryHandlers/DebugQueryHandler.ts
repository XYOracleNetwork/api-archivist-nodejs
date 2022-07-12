import { assertEx, delay } from '@xylabs/sdk-js'
import { XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'

import { DebugPayload, DebugQuery, debugSchema, QueryHandler } from '../model'

export class DebugQueryHandler implements QueryHandler<DebugQuery, DebugPayload> {
  async handle(query: DebugQuery) {
    const ms = query?.payload?.delay || 1
    assertEx(ms > 0, 'Debug delay must be a positive, non-zero number.')
    await delay(ms)
    return new XyoPayloadBuilder<DebugPayload>({ schema: debugSchema }).fields(query.payload).build()
  }
}
