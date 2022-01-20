import { Request } from 'express'
import passport, { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { IUserStore, passwordHasher } from '../model'

class ApiKeyStrategy extends Strategy {
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
          this.error({ messag: 'Error creating user' })
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

export const configureApiKeyStrategy = (userStore: IUserStore, apiKey: string) => {
  // Use for any routes we want to protect
  passport.use('apiKey', new ApiKeyStrategy(userStore, apiKey, false))
  // Used specifically for /user/signup since we want to both protect
  // the route and create the user
  passport.use('apiKeyUserSignup', new ApiKeyStrategy(userStore, apiKey, true))
}
