import { EmptyObject, XyoPayloadFindFilter } from '@xyo-network/sdk-xyo-client-js'

export type XyoPayloadFilterPredicate<T extends EmptyObject = EmptyObject> = Partial<{ archives: string[]; hash: string; schemas: string[] }> &
  XyoPayloadFindFilter &
  Partial<T>

export type XyoArchivePayloadFilterPredicate<T extends EmptyObject = EmptyObject> = {
  archive: string
} & Omit<XyoPayloadFilterPredicate<T>, 'archives'>
