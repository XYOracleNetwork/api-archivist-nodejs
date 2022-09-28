import { XyoQuery } from '@xyo-network/module'

export type StatsQueryPayload<T extends XyoQuery = XyoQuery> = XyoQuery<T & { archive?: string }>
