import passport from 'passport'

import { IUserStore } from '../../model'
import { ApiKeyStrategy } from './apiKeyStrategy'

export const configureApiKeyStrategy = (userStore: IUserStore, apiKey: string) => {
  // Use for any routes we want to protect
  passport.use('apiKey', new ApiKeyStrategy(userStore, apiKey, false))
  // Used specifically for /user/signup since we want to both protect
  // the route and create the user
  passport.use('apiKeyUserSignup', new ApiKeyStrategy(userStore, apiKey, true))
}
