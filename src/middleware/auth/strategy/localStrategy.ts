import passport from 'passport'
import { IStrategyOptions, Strategy } from 'passport-local'

import { IUserStore, IWeb2User, passwordHasher, User } from '../model'

const localStrategyOptions: IStrategyOptions = {
  passwordField: 'password',
  usernameField: 'email',
}

export const configureLocalStrategy = (userStore: IUserStore<User>) => {
  passport.use(
    'signup',
    new Strategy(localStrategyOptions, async (email, password, done) => {
      try {
        // Create user
        const passwordHash = await passwordHasher.hash(password)
        const userToCreate: IWeb2User = { email, passwordHash }

        // Store the user
        const createdUser: User = await userStore.create(userToCreate)

        // Return the user
        return done(null, createdUser)
      } catch (error) {
        done(error)
      }
    })
  )

  passport.use(
    'login',
    new Strategy(localStrategyOptions, async (email, providedPassword, done) => {
      try {
        if (!userStore?.getByEmail) {
          return done(null, false, { message: 'Unable to obtain users by email' })
        }
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
