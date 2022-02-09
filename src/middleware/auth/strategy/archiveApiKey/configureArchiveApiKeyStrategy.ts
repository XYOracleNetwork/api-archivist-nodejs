import passport from 'passport'

import { IUserStore } from '../../model'
import { ArchiveApiKeyStrategy } from './archiveApiKeyStrategy'

export const ARCHIVE_API_KEY_STRATEGY_NAME = 'archiveApiKey'
export const archiveApiKeyStrategy = passport.authenticate(ARCHIVE_API_KEY_STRATEGY_NAME, { session: false })

export const configureArchiveApiKeyStrategy = (userStore: IUserStore) => {
  passport.use(ARCHIVE_API_KEY_STRATEGY_NAME, new ArchiveApiKeyStrategy(userStore))
}
