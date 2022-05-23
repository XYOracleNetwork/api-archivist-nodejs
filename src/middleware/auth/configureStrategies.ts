import { assertEx } from '@xylabs/sdk-js'

import { AuthConfig } from './AuthConfig'
import {
  configureAdminApiKeyStrategy,
  configureAllowUnauthenticatedStrategy,
  configureArchiveAccessControlStrategy,
  configureArchiveAccountStrategy,
  configureArchiveApiKeyStrategy,
  configureArchiveOwnerStrategy,
  configureJwtStrategy,
  configureLocalStrategy,
  configureWeb3Strategy,
} from './strategy'

export const configureStrategies = (config: AuthConfig) => {
  assertEx(config?.secretOrKey, 'Missing JWT secretOrKey')
  const secretOrKey = config?.secretOrKey as string
  assertEx(config?.apiKey, 'Missing API Key')
  const apiKey = config?.apiKey as string

  configureAdminApiKeyStrategy(apiKey)
  configureAllowUnauthenticatedStrategy()
  configureArchiveAccessControlStrategy()
  configureArchiveApiKeyStrategy()
  configureArchiveAccountStrategy()
  configureArchiveOwnerStrategy()
  const jwtRequestHandler = configureJwtStrategy(secretOrKey)
  configureLocalStrategy()
  configureWeb3Strategy()

  return {
    jwtRequestHandler,
  }
}
