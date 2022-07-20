import 'reflect-metadata'

import { Request } from 'express'
import { decorate, inject, injectable, unmanaged } from 'inversify'
import { IStrategyOptionsWithRequest, Strategy } from 'passport-local'

import { TYPES } from '../../../../Dependencies'
import { User } from '../../../../model'
import { PasswordHasher } from '../../../PasswordHasher'

const strategyOptions: IStrategyOptionsWithRequest = {
  passReqToCallback: true,
  passwordField: 'password',
  usernameField: 'email',
}

@injectable()
export class LocalStrategy extends Strategy {
  constructor(@inject(TYPES.PasswordHasher) public readonly passwordHasher: PasswordHasher<User>) {
    super(strategyOptions, async (req: Request, email, providedPassword, done) => {
      try {
        // Find user
        const user = await req.app.userManager.findByEmail(email)
        // If we didn't find the user or they have no passwordHash
        if (!user || !user?.passwordHash) {
          return done(null, false, { message: 'User not found' })
        }
        // Validate user's password
        const valid = await this.passwordHasher.verify(user, providedPassword)
        if (!valid) {
          return done(null, false, { message: 'Wrong Password' })
        }
        return done(null, user, { message: 'Logged in Successfully' })
      } catch (error) {
        return done(error)
      }
    })
  }
}
