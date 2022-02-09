import passport from 'passport'

import { IUserStore } from '../../model'
import { AdminApiKeyStrategy } from './adminApiKeyStrategy'

const archiveApiKeyStrategyName = 'adminApiKey'
export const adminApiKeyStrategy = passport.authenticate(archiveApiKeyStrategyName, { session: false })

const adminApiKeyUserSignupStrategyName = 'adminApiKeyUserSignup'
export const adminApiKeyUserSignupStrategy = passport.authenticate(adminApiKeyUserSignupStrategyName, {
  session: false,
})

export const configureAdminApiKeyStrategy = (userStore: IUserStore, apiKey: string) => {
  // Use for any routes we want to protect
  passport.use(archiveApiKeyStrategyName, new AdminApiKeyStrategy(userStore, apiKey, false))
  // Used specifically for /user/signup since we want to both protect
  // the route and create the user
  passport.use(adminApiKeyUserSignupStrategyName, new AdminApiKeyStrategy(userStore, apiKey, true))
}
