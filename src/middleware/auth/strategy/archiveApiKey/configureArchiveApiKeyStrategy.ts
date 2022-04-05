import passport from 'passport'

import { UserStore } from '../../model'
import { ArchiveApiKeyStrategy } from './archiveApiKeyStrategy'

export const archiveApiKeyStrategyName = 'archiveApiKey'
export const archiveApiKeyStrategy = passport.authenticate(archiveApiKeyStrategyName, { session: false })

export const configureArchiveApiKeyStrategy = (userStore: UserStore) => {
  passport.use(archiveApiKeyStrategyName, new ArchiveApiKeyStrategy(userStore))
}
