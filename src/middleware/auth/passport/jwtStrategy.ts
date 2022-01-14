import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt'

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
  secretOrKey: 'TOP_SECRET',
}
export const configureJwtStrategy = (audience = 'archivist', issuer = 'archivist', secretOrKey = 'TOP_SECRET') => {
  const jwtStrategyOptions: StrategyOptions = { ...defaultJWTStrategyOptions, audience, issuer, secretOrKey }
  passport.use(
    new JWTStrategy(jwtStrategyOptions, (token, done) => {
      try {
        return done(null, token.user)
      } catch (error) {
        done(error)
      }
    })
  )
}
