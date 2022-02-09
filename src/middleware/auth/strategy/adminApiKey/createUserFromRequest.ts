import { Request } from 'express'

import { IUserStore, passwordHasher, User } from '../../model'

export const createUserFromRequest = async (req: Request, userStore: IUserStore): Promise<User> => {
  const userToCreate = req.body
  if (userToCreate.password) {
    userToCreate.passwordHash = await passwordHasher.hash(userToCreate.password)
    delete userToCreate.password
  }
  return userStore.create(userToCreate)
}
