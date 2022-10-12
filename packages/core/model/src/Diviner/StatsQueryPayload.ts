import { XyoQuery } from '@xyo-network/module'

// TODO: Rename to archive query payload
// TODO: Remove and inject archive in config?
export type StatsQueryPayload<T extends XyoQuery = XyoQuery> = XyoQuery<T & { archive?: string }>
