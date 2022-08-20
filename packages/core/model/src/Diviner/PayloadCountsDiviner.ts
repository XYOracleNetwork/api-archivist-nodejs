import { XyoDiviner, XyoPayload, XyoQueryPayload } from '@xyo-network/sdk-xyo-client-js'

export type PayloadStatsSchema = 'network.xyo.archivist.payload.stats'
export const PayloadStatsSchema: PayloadStatsSchema = 'network.xyo.archivist.payload.stats'

export type PayloadStatsQuerySchema = 'network.xyo.archivist.payload.stats.query'
export const PayloadStatsQuerySchema: PayloadStatsQuerySchema = 'network.xyo.archivist.payload.stats.query'

export type PayloadCountsPayload = XyoPayload<{ count: number; schema: PayloadStatsSchema }>
export type PayloadCountsQueryPayload = XyoQueryPayload<{ archive?: string; schema: PayloadStatsQuerySchema }>

export type PayloadCountsDiviner = XyoDiviner<PayloadCountsQueryPayload>
