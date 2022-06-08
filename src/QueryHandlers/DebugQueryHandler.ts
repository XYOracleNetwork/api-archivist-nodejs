import { delay } from '@xylabs/sdk-js'

import { DebugQuery, QueryHandler } from '../model'

export class DebugQueryHandler implements QueryHandler<DebugQuery> {
  async handle(query: DebugQuery) {
    const ms = query?.payload?.delay || 1
    await delay(ms)
  }
}
