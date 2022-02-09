import passport from 'passport'

import { IUserStore } from '../../model'
import { ArchiveApiKeyStrategy } from './archiveApiKeyStrategy'

export const archiveApiKeyStrategyName = 'archiveApiKey'
export const archiveApiKeyStrategy = passport.authenticate(archiveApiKeyStrategyName, { session: false })

export const configureArchiveApiKeyStrategy = (userStore: IUserStore) => {
  passport.use(archiveApiKeyStrategyName, new ArchiveApiKeyStrategy(userStore))
}
