import { XyoDiviner, XyoPayload, XyoQueryPayload } from '@xyo-network/sdk-xyo-client-js'

export type BoundWitnessStatsSchema = 'network.xyo.archivist.boundwitness.stats'
export const BoundWitnessStatsSchema: BoundWitnessStatsSchema = 'network.xyo.archivist.boundwitness.stats'

export type BoundWitnessStatsQuerySchema = 'network.xyo.archivist.boundwitness.stats.query'
export const BoundWitnessStatsQuerySchema: BoundWitnessStatsQuerySchema = 'network.xyo.archivist.boundwitness.stats.query'

export type BoundWitnessCountsPayload = XyoPayload<{ count: number; schema: BoundWitnessStatsSchema }>
export type BoundWitnessCountsQueryPayload = XyoQueryPayload<{ archive?: string; schema: BoundWitnessStatsQuerySchema }>

export type BoundWitnessCountsDiviner = XyoDiviner<BoundWitnessCountsQueryPayload>
