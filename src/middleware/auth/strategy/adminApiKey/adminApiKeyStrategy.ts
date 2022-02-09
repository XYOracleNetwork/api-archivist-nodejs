import { Request } from 'express'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { IUserStore, passwordHasher } from '../../model'

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
    req: Request,
    _options?: unknown
  ) {
    try {
      if (req.headers[this.apiKeyHeader] !== this.apiKey) {
        this.fail('Invalid API key')
        return
      }
      if (this.createUser) {
        const userToCreate = req.body
        if (userToCreate.password) {
          userToCreate.passwordHash = await passwordHasher.hash(userToCreate.password)
          delete userToCreate.password
        }
        const user = await this.userStore.create(userToCreate)
        if (!user) {
          this.error({ message: 'Error creating user' })
          return
        }
        this.success(user)
        return
      }
      this.success({})
      return
    } catch (error) {
      this.error({ message: 'API Key Auth Error' })
    }
  }
}
