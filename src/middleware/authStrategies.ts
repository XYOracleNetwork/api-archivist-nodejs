import { compare, hash } from 'bcrypt'
import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt'
import { IStrategyOptions, Strategy as LocalStrategy } from 'passport-local'

interface IUser {
  _id: string
  email: string
  passwordHash: string
}
const shamefulInMemoryUserStore: Record<string, IUser | undefined> = {}
const localStrategyOptions: IStrategyOptions = {
  passwordField: 'password',
  usernameField: 'email',
}
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
let lastUserId = 0
export const configureAuthStrategies = (audience = 'archivist', issuer = 'archivist', secretOrKey = 'TOP_SECRET') => {
  passport.use(
    'signup',
    new LocalStrategy(localStrategyOptions, async (email, password, done) => {
      try {
        // Create user
        const passwordHash = await hash(password, 10)
        const _id = `${++lastUserId}`
        const createdUser: IUser = { _id, email, passwordHash }

        // Store the user
        shamefulInMemoryUserStore[email] = createdUser

        // Return the user
        const returnedUser = { _id, email }
        return done(null, returnedUser)
      } catch (error) {
        done(error)
      }
    })
  )

  passport.use(
    'login',
    new LocalStrategy(localStrategyOptions, async (email, password, done) => {
      try {
        // Find user
        await Promise.resolve()
        const user = shamefulInMemoryUserStore[email]
        if (!user) {
          return done(null, false, { message: 'User not found' })
        }
        // Validate user's password
        const validate = await compare(password, user.passwordHash)
        if (!validate) {
          return done(null, false, { message: 'Wrong Password' })
        }
        return done(null, user, { message: 'Logged in Successfully' })
      } catch (error) {
        return done(error)
      }
    })
  )

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
