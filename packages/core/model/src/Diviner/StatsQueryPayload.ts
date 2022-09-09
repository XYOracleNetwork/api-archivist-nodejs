import { XyoQueryPayload } from '@xyo-network/module'

export type ArchiveStatsQueryPayload<T extends XyoQueryPayload = XyoQueryPayload> = XyoQueryPayload<T & { archive?: string }>
