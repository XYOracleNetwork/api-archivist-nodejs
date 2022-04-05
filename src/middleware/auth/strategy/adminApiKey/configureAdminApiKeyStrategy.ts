import passport from 'passport'

import { AdminApiKeyStrategy } from './adminApiKeyStrategy'

const archiveApiKeyStrategyName = 'adminApiKey'
export const adminApiKeyStrategy = passport.authenticate(archiveApiKeyStrategyName, { session: false })

export const configureAdminApiKeyStrategy = (apiKey: string) => {
  passport.use(archiveApiKeyStrategyName, new AdminApiKeyStrategy(apiKey))
}
