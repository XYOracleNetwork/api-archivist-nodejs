import { XyoQueryPayload } from '@xyo-network/module'

export type StatsQueryPayload<T extends XyoQueryPayload = XyoQueryPayload> = XyoQueryPayload<T & { archive?: string }>
