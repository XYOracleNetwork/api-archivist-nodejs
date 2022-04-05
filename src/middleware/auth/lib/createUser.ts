import { UpsertResult } from '../../../lib'
import { passwordHasher, User, UserStore, UserWithoutId } from '../model'

export const createUser = async (
  user: UserWithoutId,
  userStore: UserStore,
  password?: string
): Promise<User & UpsertResult> => {
  if (password) {
    user.passwordHash = await passwordHasher.hash(password)
  }
  return userStore.create(user)
}
