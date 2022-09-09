import { XyoPayload } from '@xyo-network/payload'

import { ArchivistPayloadStatsDivinerConfig } from './PayloadStatsDiviner'
import { ArchiveStatsQueryPayload, StatsDiviner, StatsPayload } from './StatsDiviner'

export type BoundWitnessStatsSchema = 'network.xyo.archivist.boundwitness.stats'
export const BoundWitnessStatsSchema: BoundWitnessStatsSchema = 'network.xyo.archivist.boundwitness.stats'

export type BoundWitnessStatsQuerySchema = 'network.xyo.archivist.boundwitness.stats.query'
export const BoundWitnessStatsQuerySchema: BoundWitnessStatsQuerySchema = 'network.xyo.archivist.boundwitness.stats.query'

export type BoundWitnessStatsConfigSchema = 'network.xyo.archivist.boundwitness.stats.config'
export const BoundWitnessStatsConfigSchema: BoundWitnessStatsConfigSchema = 'network.xyo.archivist.boundwitness.stats.config'

export type BoundWitnessStatsDivinerConfig<
  S extends string = BoundWitnessStatsConfigSchema,
  T extends XyoPayload = XyoPayload,
> = ArchivistPayloadStatsDivinerConfig<
  S,
  T & {
    schema: S
  }
>

export type BoundWitnessStatsPayload = StatsPayload<{ schema: BoundWitnessStatsSchema }>
export type BoundWitnessStatsQueryPayload = ArchiveStatsQueryPayload<{ schema: BoundWitnessStatsQuerySchema }>

export type BoundWitnessStatsDiviner = StatsDiviner
