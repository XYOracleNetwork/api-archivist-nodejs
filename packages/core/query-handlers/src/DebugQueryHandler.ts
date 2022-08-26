import { assertEx, delay } from '@xylabs/sdk-js'
import { DebugPayload, DebugQuery, debugSchema, QueryHandler } from '@xyo-network/archivist-model'
import { XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { injectable } from 'inversify'

@injectable()
class DebugQueryHandler implements QueryHandler<DebugQuery, DebugPayload> {
  async handle(query: DebugQuery) {
    const ms = query?.payload?.delay || 1
    assertEx(ms > 0, 'Debug delay must be a positive, non-zero number.')
    await delay(ms)
    return new XyoPayloadBuilder<DebugPayload>({ schema: debugSchema }).fields(query.payload).build()
  }
}
exports = { DebugQueryHandler }
