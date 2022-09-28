import { XyoPayloadFindFilter } from '@xyo-network/archivist'
import { EmptyObject } from '@xyo-network/core'

export type XyoPayloadFilterPredicate<T extends EmptyObject = EmptyObject> = Partial<{
  archives: string[]
  hash: string
  offset: number
  schemas: string[]
}> &
  XyoPayloadFindFilter &
  Partial<T>
