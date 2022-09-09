import { XyoDivinerConfig } from '@xyo-network/diviner'
import { XyoPayload } from '@xyo-network/payload'

import { ArchiveStatsQueryPayload, StatsDiviner, StatsPayload } from './StatsDiviner'

export type PayloadStatsSchema = 'network.xyo.archivist.payload.stats'
export const PayloadStatsSchema: PayloadStatsSchema = 'network.xyo.archivist.payload.stats'

export type ArchivistPayloadStatsDivinerConfigSchema = 'network.xyo.archivist.payload.stats.config'
export const ArchivistPayloadStatsDivinerConfigSchema: ArchivistPayloadStatsDivinerConfigSchema = 'network.xyo.archivist.payload.stats.config'

export type ArchivistPayloadStatsDivinerConfig<S extends string = string, T extends XyoPayload = XyoPayload> = XyoDivinerConfig<
  T & {
    schema: S
  }
>

export type PayloadStatsQuerySchema = 'network.xyo.archivist.payload.stats.query'
export const PayloadStatsQuerySchema: PayloadStatsQuerySchema = 'network.xyo.archivist.payload.stats.query'

export type PayloadStatsPayload = StatsPayload<{ schema: PayloadStatsSchema }>
export type PayloadStatsQueryPayload = ArchiveStatsQueryPayload<{ schema: PayloadStatsQuerySchema }>

export type PayloadStatsDiviner = StatsDiviner
