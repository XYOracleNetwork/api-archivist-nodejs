import passport from 'passport'

import { IUserStore } from '../../model'
import { AdminApiKeyStrategy } from './adminApiKeyStrategy'

export const configureAdminApiKeyStrategy = (userStore: IUserStore, apiKey: string) => {
  // Use for any routes we want to protect
  passport.use('adminApiKey', new AdminApiKeyStrategy(userStore, apiKey, false))
  // Used specifically for /user/signup since we want to both protect
  // the route and create the user
  passport.use('adminApiKeyUserSignup', new AdminApiKeyStrategy(userStore, apiKey, true))
}
