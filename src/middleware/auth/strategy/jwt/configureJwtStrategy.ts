import { RequestHandler } from 'express'
import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt'

import { getJwtRequestHandler } from './respondWithJwt'
import { algorithms } from './SupportedAlgorithms'

// TODO: Pass in PUBLIC_ORIGIN here for full URL
const audience = 'archivist'
const issuer = 'archivist'

const defaultJWTStrategyOptions: StrategyOptions = {
  algorithms,
  audience,
  ignoreExpiration: false,
  issuer,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

export const jwtStrategyName = 'jwt'
export const jwtStrategy = passport.authenticate(jwtStrategyName, { session: false })

export const configureJwtStrategy = (secretOrKey: string): RequestHandler => {
  const jwtStrategyOptions: StrategyOptions = { ...defaultJWTStrategyOptions, secretOrKey }

  passport.use(
    jwtStrategyName,
    new JWTStrategy(jwtStrategyOptions, (token, done) => {
      try {
        return done(null, token.user)
      } catch (error) {
        done(error)
      }
    })
  )
  return getJwtRequestHandler(secretOrKey, { audience, issuer })
}
