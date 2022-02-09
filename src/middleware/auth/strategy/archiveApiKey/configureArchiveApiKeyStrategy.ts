import passport from 'passport'

import { IUserStore } from '../../model'
import { ArchiveApiKeyStrategy } from './archiveApiKeyStrategy'

export const configureArchiveApiKeyStrategy = (userStore: IUserStore) => {
  passport.use('archiveApiKey', new ArchiveApiKeyStrategy(userStore))
}
