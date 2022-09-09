import { XyoDiviner } from '@xyo-network/diviner'
import { XyoQueryPayload } from '@xyo-network/module'
import { XyoPayload } from '@xyo-network/payload'

export type StatsPayload<T extends XyoPayload = XyoPayload> = XyoPayload<T & { count: number }>

export type ArchiveStatsQueryPayload<T extends XyoQueryPayload = XyoQueryPayload> = XyoQueryPayload<T & { archive?: string }>

export type StatsDiviner = XyoDiviner
