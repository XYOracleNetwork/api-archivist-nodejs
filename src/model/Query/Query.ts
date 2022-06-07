import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

export interface Query extends XyoPayload {
  _address?: string
}
