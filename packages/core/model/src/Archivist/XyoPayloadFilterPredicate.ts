import { XyoPayloadFindFilter } from '@xyo-network/sdk-xyo-client-js'

export type XyoPayloadFilterPredicate<T extends Partial<{ hash: string; schema: string }> = Partial<{ hash: string; schema: string }>> =
  XyoPayloadFindFilter & Partial<T>

export type XyoArchivePayloadFilterPredicate<T extends Partial<{ schema: string }> = Partial<{ schema: string }>> = XyoPayloadFilterPredicate<T> & {
  archive: string
}
