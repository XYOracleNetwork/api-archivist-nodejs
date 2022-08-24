import { EmptyObject } from '@xyo-network/sdk-xyo-client-js'
import { OptionalId, WithId, WithoutId } from 'mongodb'

export const removeId = <T extends EmptyObject = EmptyObject>(payload: T | WithId<T> | WithoutId<T> | OptionalId<T>): WithoutId<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...withoutId } = payload as OptionalId<T>
  return withoutId as WithoutId<T>
}
