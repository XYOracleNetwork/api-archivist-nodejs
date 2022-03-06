import { Request } from 'express'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { IUserStore } from '../../model'
import { createUserFromRequest } from './createUserFromRequest'

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
        const user = await createUserFromRequest(req, this.userStore)
        if (!user) {
          this.error({ message: 'Error creating user' })
          return
        }
        const { updated } = user
        this.success(user, { updated })
        return
      }
      this.success({})
      return
    } catch (error) {
      this.error({ message: 'Admin API Key Auth Error' })
    }
  }
}
