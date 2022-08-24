import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { StatsSchema } from './StatsSchema'

export type ArchiveStatsPayload = XyoPayload<{
  count: number
  schema: StatsSchema
}>
