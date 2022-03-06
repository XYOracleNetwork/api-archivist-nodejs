import { Request } from 'express'

import { UpsertResult } from '../../../../lib'
import { IUserStore, passwordHasher, User } from '../../model'

export const createUserFromRequest = async (req: Request, userStore: IUserStore): Promise<User & UpsertResult> => {
  const userToCreate = req.body
  if (userToCreate.password) {
    userToCreate.passwordHash = await passwordHasher.hash(userToCreate.password)
    delete userToCreate.password
  }
  return userStore.create(userToCreate)
}
