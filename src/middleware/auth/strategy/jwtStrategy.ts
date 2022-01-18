import { NextFunction, Request, Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt'

import { IWeb2User, IWeb3User, User } from '../model'

export type JwtLoginFunction = (user: User, req: Request, res: Response, next: NextFunction) => void

const defaultJWTStrategyOptions: StrategyOptions = {
  // NOTE: Anything but NONE here
  algorithms: [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'ES256',
    'ES384',
    'ES512',
    'PS256',
    'PS384',
    'PS512',
  ],
  audience: 'archivist',
  ignoreExpiration: false,
  issuer: 'archivist',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

export const configureJwtStrategy = (secretOrKey: string): JwtLoginFunction => {
  const jwtStrategyOptions: StrategyOptions = { ...defaultJWTStrategyOptions, secretOrKey }

  passport.use(
    new JWTStrategy(jwtStrategyOptions, (token, done) => {
      try {
        return done(null, token.user)
      } catch (error) {
        done(error)
      }
    })
  )

  const loginUser: JwtLoginFunction = (user, req, res, next) => {
    try {
      req.login(user, { session: false }, (error) => {
        if (error) return next(error)
        const options: SignOptions = {
          algorithm: 'HS256', // 'HS512' once we perf
          audience: 'archivist',
          expiresIn: '1 day',
          issuer: 'archivist',
          subject: user.id,
        }

        // TODO: Something smarter than needing to
        // remember to sanitize response data
        // Omit sensitive data
        const responseUser: Partial<IWeb2User> & Partial<IWeb3User> = { ...user }
        delete responseUser.passwordHash
        delete responseUser.address

        // eslint-disable-next-line import/no-named-as-default-member
        const token = jwt.sign({ user: responseUser }, secretOrKey, options)
        res.json({ token })
        return
      })
    } catch (error) {
      next(error)
      return
    }
  }
  return loginUser
}
