import passport from 'passport'

import { ArchiveApiKeyStrategy } from './archiveApiKeyStrategy'

export const archiveApiKeyStrategyName = 'archiveApiKey'
export const archiveApiKeyStrategy = passport.authenticate(archiveApiKeyStrategyName, { session: false })

export const configureArchiveApiKeyStrategy = () => {
  passport.use(archiveApiKeyStrategyName, new ArchiveApiKeyStrategy())
}
