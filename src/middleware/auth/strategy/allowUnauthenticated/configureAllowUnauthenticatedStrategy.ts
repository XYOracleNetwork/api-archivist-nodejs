import passport from 'passport'

import { AllowUnauthenticatedStrategy } from './allowUnauthenticatedStrategy'

export const allowUnauthenticatedStrategyName = 'allowUnauthenticated'
export const allowUnauthenticatedStrategy = passport.authenticate(allowUnauthenticatedStrategyName, { session: false })

export const configureAllowUnauthenticatedStrategy = () => {
  passport.use(allowUnauthenticatedStrategyName, new AllowUnauthenticatedStrategy())
}
