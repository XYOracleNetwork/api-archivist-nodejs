import { assertEx } from '@xylabs/sdk-js'

import { AuthConfig } from './AuthConfig'
import {
  configureArchiveAccessControlStrategy,
  configureArchiveAccountStrategy,
  configureArchiveApiKeyStrategy,
  configureArchiveOwnerStrategy,
  configureJwtStrategy,
  configureLocalStrategy,
} from './strategy'

export const configureStrategies = (config: AuthConfig) => {
  assertEx(config?.secretOrKey, 'Missing JWT secretOrKey')
  const secretOrKey = config?.secretOrKey as string
  configureArchiveAccessControlStrategy()
  configureArchiveAccountStrategy()
  configureArchiveApiKeyStrategy()
  configureArchiveOwnerStrategy()
  const jwtRequestHandler = configureJwtStrategy(secretOrKey)
  configureLocalStrategy()

  return {
    jwtRequestHandler,
  }
}
