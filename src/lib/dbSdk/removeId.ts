import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { OptionalId } from 'mongodb'

export const removeId = (payload: OptionalId<XyoPayload>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...withoutId } = payload
  return withoutId
}
