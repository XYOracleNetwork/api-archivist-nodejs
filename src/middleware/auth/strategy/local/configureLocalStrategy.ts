import { Request } from 'express'
import passport from 'passport'
import { IStrategyOptionsWithRequest, Strategy } from 'passport-local'

import { passwordHasher, UserStore } from '../../model'

const strategyOptions: IStrategyOptionsWithRequest = {
  passReqToCallback: true,
  passwordField: 'password',
  usernameField: 'email',
}

export const localStrategyName = 'local'
export const localStrategy = passport.authenticate(localStrategyName, { session: false })

export const configureLocalStrategy = (userStore: UserStore) => {
  passport.use(
    localStrategyName,
    new Strategy(strategyOptions, async (_req: Request, email, providedPassword, done) => {
      try {
        // Find user
        const user = await userStore.getByEmail(email)
        // If we didn't find the user or they have no passwordHash
        if (!user || !user?.passwordHash) {
          return done(null, false, { message: 'User not found' })
        }
        // Validate user's password
        const valid = await passwordHasher.verify(user, providedPassword)
        if (!valid) {
          return done(null, false, { message: 'Wrong Password' })
        }
        return done(null, user, { message: 'Logged in Successfully' })
      } catch (error) {
        return done(error)
      }
    })
  )
}
