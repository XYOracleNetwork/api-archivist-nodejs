import 'source-map-support/register'

import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { toUserDto } from '../../../dto'
import { createUser } from '../../../lib'
import { User, UserStore, UserWithoutId } from '../../../model'

const message = 'Signup successful'

interface UserToCreate extends UserWithoutId {
  password?: string
}

export interface UserCreationResponse {
  message: string
  user: User
}

export const postUserSignup = (userStore: UserStore) => {
  return asyncHandler(async (req: Request<NoReqParams, UserCreationResponse, UserToCreate>, res: Response<UserCreationResponse>, next: NextFunction) => {
    const userToCreate = req.body
    const password = userToCreate.password
    if (password) {
      delete userToCreate.password
    }
    const createdUser = await createUser(userToCreate, userStore, password)
    if (!createdUser) {
      next({ message: 'Error creating user' })
      return
    }
    const updated = createdUser.updated
    const user = toUserDto(createdUser)
    res.status(updated ? StatusCodes.OK : StatusCodes.CREATED).json({
      message,
      user,
    })
    next()
  })
}
