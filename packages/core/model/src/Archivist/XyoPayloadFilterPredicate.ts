import { XyoPayloadFindFilter } from '@xyo-network/sdk-xyo-client-js'

export type XyoPayloadFilterPredicate<T> = XyoPayloadFindFilter & Partial<T>

export type XyoArchivePayloadFilterPredicate<T> = XyoPayloadFilterPredicate<T> & {
  archive: string
}
