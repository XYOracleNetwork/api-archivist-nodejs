import { Request } from 'express'

import { IUserStore, passwordHasher, User } from '../../model'

export const createUser = async (req: Request, userStore: IUserStore): Promise<User> => {
  const userToCreate = req.body
  if (userToCreate.password) {
    userToCreate.passwordHash = await passwordHasher.hash(userToCreate.password)
    delete userToCreate.password
  }
  const user = await userStore.create(userToCreate)
  return user
}
