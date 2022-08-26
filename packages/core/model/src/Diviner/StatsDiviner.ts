import { XyoDiviner, XyoPayload, XyoQueryPayload } from '@xyo-network/sdk-xyo-client-js'

export type StatsPayload<T extends XyoPayload = XyoPayload> = XyoPayload<T & { count: number }>

export type ArchiveStatsQueryPayload<T extends XyoQueryPayload = XyoQueryPayload> = XyoQueryPayload<T & { archive?: string }>

export type StatsDiviner = XyoDiviner
