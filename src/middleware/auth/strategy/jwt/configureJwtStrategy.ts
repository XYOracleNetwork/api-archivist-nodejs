import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { SignOptions } from 'jsonwebtoken'
import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt'

import { toUserDto } from '../../dto'
import { signJwt } from './signJwt'

const algorithm = 'HS256' // 'HS512' once we perf
const audience = 'archivist'
const issuer = 'archivist'

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
  audience,
  ignoreExpiration: false,
  issuer,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

export const configureJwtStrategy = (secretOrKey: string): RequestHandler => {
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

  const respondWithJwt: RequestHandler = (req, res, next) => {
    try {
      const { user } = req
      if (!user || !user?.id) {
        next({ message: 'Invalid User', statusCode: StatusCodes.UNAUTHORIZED })
        return
      }
      req.login(user, { session: false }, async (error) => {
        if (error) {
          return next(error)
        }
        const options: SignOptions = {
          algorithm,
          audience,
          expiresIn: '1 day',
          issuer,
          subject: user.id,
        }
        const token = await signJwt(toUserDto(user), secretOrKey, options)
        res.json({ token })
        return
      })
    } catch (error) {
      next(error)
      return
    }
  }
  return respondWithJwt
}
