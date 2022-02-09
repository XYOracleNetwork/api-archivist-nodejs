import passport from 'passport'

import { IUserStore } from '../../model'
import { AdminApiKeyStrategy } from './adminApiKeyStrategy'

const ADMIN_API_KEY_STRATEGY_NAME = 'adminApiKey'
export const adminApiKeyStrategy = passport.authenticate(ADMIN_API_KEY_STRATEGY_NAME, { session: false })

const ADMIN_API_KEY_USER_SIGNUP_STRATEGY_NAME = 'adminApiKeyUserSignup'
export const adminApiKeyUserSignupStrategy = passport.authenticate(ADMIN_API_KEY_USER_SIGNUP_STRATEGY_NAME, {
  session: false,
})

export const configureAdminApiKeyStrategy = (userStore: IUserStore, apiKey: string) => {
  // Use for any routes we want to protect
  passport.use(ADMIN_API_KEY_STRATEGY_NAME, new AdminApiKeyStrategy(userStore, apiKey, false))
  // Used specifically for /user/signup since we want to both protect
  // the route and create the user
  passport.use(ADMIN_API_KEY_USER_SIGNUP_STRATEGY_NAME, new AdminApiKeyStrategy(userStore, apiKey, true))
}
