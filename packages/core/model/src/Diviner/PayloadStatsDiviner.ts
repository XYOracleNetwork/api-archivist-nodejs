import { ArchiveStatsQueryPayload, StatsDiviner, StatsPayload } from './StatsDiviner'

export type PayloadStatsSchema = 'network.xyo.archivist.payload.stats'
export const PayloadStatsSchema: PayloadStatsSchema = 'network.xyo.archivist.payload.stats'

export type PayloadStatsQuerySchema = 'network.xyo.archivist.payload.stats.query'
export const PayloadStatsQuerySchema: PayloadStatsQuerySchema = 'network.xyo.archivist.payload.stats.query'

export type PayloadStatsPayload = StatsPayload<{ schema: PayloadStatsSchema }>
export type PayloadStatsQueryPayload = ArchiveStatsQueryPayload<{ schema: PayloadStatsQuerySchema }>

export type PayloadStatsDiviner = StatsDiviner<PayloadStatsQueryPayload>
