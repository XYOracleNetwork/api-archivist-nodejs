import { RequestHandler } from 'express'
import { ExtractJwt, Strategy, StrategyOptions, VerifyCallbackWithRequest } from 'passport-jwt'

import { getJwtRequestHandler } from './respondWithJwt'
import { algorithms } from './SupportedAlgorithms'

// TODO: Pass in PUBLIC_ORIGIN here for full URL
const audience = 'archivist'
const issuer = 'archivist'

const defaults: StrategyOptions = {
  algorithms,
  audience,
  ignoreExpiration: false,
  issuer,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

export const verifyCallbackWithRequest: VerifyCallbackWithRequest = (token, done) => {
  try {
    return done(null, token.user)
  } catch (error) {
    done(error)
  }
}

export class JwtStrategy extends Strategy {
  constructor(public readonly secretOrKey: string) {
    super({ ...defaults, secretOrKey }, verifyCallbackWithRequest)
  }

  public get jwtRequestHandler(): RequestHandler {
    return getJwtRequestHandler(this.secretOrKey, { audience, issuer })
  }
}
