import { Request } from 'express'
import passport, { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { IUserStore, User } from '../model'

class ApiKeyStrategy extends Strategy {
  constructor(
    public readonly userStore: IUserStore<User>,
    public readonly apiKey: string,
    public readonly apiKeyHeader = 'x-api-key'
  ) {
    super()
  }
  override async authenticate(
    this: StrategyCreated<this, this & StrategyCreatedStatic>,
    req: Request,
    _options?: unknown
  ) {
    if (req.headers[this.apiKeyHeader] !== this.apiKey) {
      this.fail('Invalid API key')
      return
    }
    const user = await this.userStore.create(req.body)
    if (!user) {
      this.error('Error creating user')
      return
    }
    this.success(user)
    return
  }
}

export const configureApiKeyStrategy = (userStore: IUserStore<User>, apiKey: string) => {
  passport.use('apiKey', new ApiKeyStrategy(userStore, apiKey))
}
