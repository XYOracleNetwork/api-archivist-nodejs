import passport from 'passport'
import { IStrategyOptions, Strategy } from 'passport-local'

import { IUserStore, passwordHasher } from '../../model'

const localStrategyOptions: IStrategyOptions = {
  passwordField: 'password',
  usernameField: 'email',
}

export const configureLocalStrategy = (userStore: IUserStore) => {
  passport.use(
    'login',
    new Strategy(localStrategyOptions, async (email, providedPassword, done) => {
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
