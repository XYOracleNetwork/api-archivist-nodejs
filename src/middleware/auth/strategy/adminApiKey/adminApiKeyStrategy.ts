import { getDefaultLogger } from '@xylabs/sdk-api-express-ecs'
import { Request } from 'express'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

export class AdminApiKeyStrategy extends Strategy {
  constructor(public readonly apiKey: string, public readonly apiKeyHeader = 'x-api-key', public readonly logger = getDefaultLogger()) {
    super()
  }

  override authenticate(this: StrategyCreated<this, this & StrategyCreatedStatic>, req: Request, _options?: unknown) {
    try {
      if (req.headers[this.apiKeyHeader] !== this.apiKey) {
        this.fail('Invalid API key')
        return
      }
      this.success(req.user || {})
      return
    } catch (error) {
      this.logger.error(JSON.stringify(error, null, 2))
      this.error({ message: 'Admin API Key Auth Error' })
    }
  }
}
