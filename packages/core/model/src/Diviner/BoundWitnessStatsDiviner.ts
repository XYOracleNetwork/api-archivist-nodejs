import { ArchiveStatsQueryPayload, StatsDiviner, StatsPayload } from './StatsDiviner'

export type BoundWitnessStatsSchema = 'network.xyo.archivist.boundwitness.stats'
export const BoundWitnessStatsSchema: BoundWitnessStatsSchema = 'network.xyo.archivist.boundwitness.stats'

export type BoundWitnessStatsQuerySchema = 'network.xyo.archivist.boundwitness.stats.query'
export const BoundWitnessStatsQuerySchema: BoundWitnessStatsQuerySchema = 'network.xyo.archivist.boundwitness.stats.query'

export type BoundWitnessStatsPayload = StatsPayload<{ schema: BoundWitnessStatsSchema }>
export type BoundWitnessStatsQueryPayload = ArchiveStatsQueryPayload<{ schema: BoundWitnessStatsQuerySchema }>

export type BoundWitnessStatsDiviner = StatsDiviner<BoundWitnessStatsQueryPayload>
