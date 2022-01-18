import { RequestHandler } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt'

import { toUserDto, UserDto } from '../dto'
import { User } from '../model'

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

const signJwt = async (user: UserDto, secretOrKey: string, options: SignOptions): Promise<string | undefined> => {
  return await new Promise<string | undefined>((resolve, reject) => {
    // eslint-disable-next-line import/no-named-as-default-member
    jwt.sign({ user }, secretOrKey, options, (err: Error | null, encoded?: string) => {
      if (err) {
        console.log('Error signing JWT')
        console.log(err)
        // Don't reject with anything so we don't leak sensitive information
        reject()
      } else {
        resolve(encoded)
      }
    })
  })
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
      const user = req.user as User
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
