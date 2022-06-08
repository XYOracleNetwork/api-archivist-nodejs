import { Huri } from '@xyo-network/sdk-xyo-client-js'

export interface IdentifiableHuri {
  huri: Huri | null
  id: string
}
