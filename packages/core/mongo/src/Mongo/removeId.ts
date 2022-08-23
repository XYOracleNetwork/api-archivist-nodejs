import { OptionalId, WithoutId } from 'mongodb'

export const removeId = <T>(payload: OptionalId<T>): WithoutId<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...withoutId } = payload
  return withoutId as WithoutId<T>
}
