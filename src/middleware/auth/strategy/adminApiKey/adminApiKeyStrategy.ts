import { NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { Request } from 'express'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { IUserStore, User, UserWithoutId } from '../../model'
import { createUser } from '../lib'

interface UserToCreate extends UserWithoutId {
  password?: string
}

export class AdminApiKeyStrategy extends Strategy {
  constructor(
    public readonly userStore: IUserStore,
    public readonly apiKey: string,
    public readonly createUser = false,
    public readonly apiKeyHeader = 'x-api-key'
  ) {
    super()
  }

  override async authenticate(
    this: StrategyCreated<this, this & StrategyCreatedStatic>,
    req: Request<NoReqParams, User, UserToCreate>,
    _options?: unknown
  ) {
    try {
      if (req.headers[this.apiKeyHeader] !== this.apiKey) {
        this.fail('Invalid API key')
        return
      }
      if (this.createUser) {
        const userToCreate = req.body
        const password = userToCreate.password
        if (password) {
          delete userToCreate.password
        }
        const user = await createUser(userToCreate, this.userStore, password)
        if (!user) {
          this.error({ message: 'Error creating user' })
          return
        }
        const { updated } = user
        this.success(user, { updated })
        return
      }
      this.success(req.user || {})
      return
    } catch (error) {
      console.log(JSON.stringify(error, null, 2))
      this.error({ message: 'Admin API Key Auth Error' })
    }
  }
}
