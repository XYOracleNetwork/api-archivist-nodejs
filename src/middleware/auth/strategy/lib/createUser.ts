import { UpsertResult } from '../../../../lib'
import { IUserStore, passwordHasher, User, UserWithoutId } from '../../model'

export const createUser = async (
  userToCreate: UserWithoutId,
  userStore: IUserStore,
  password?: string
): Promise<User & UpsertResult> => {
  if (password) {
    userToCreate.passwordHash = await passwordHasher.hash(password)
  }
  return userStore.create(userToCreate)
}
