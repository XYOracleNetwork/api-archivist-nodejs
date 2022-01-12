import passport from 'passport'
import { ExtractJwt, Strategy as JWTstrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

passport.use(
  'signup',
  new LocalStrategy(
    {
      passwordField: 'password',
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        // TODO: Create user
        await Promise.resolve()
        const user = {}
        return done(null, user)
      } catch (error) {
        done(error)
      }
    }
  )
)
passport.use(
  'login',
  new LocalStrategy(
    {
      passwordField: 'password',
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        // TODO: Find user
        await Promise.resolve()
        const user = {}
        if (!user) {
          return done(null, false, { message: 'User not found' })
        }
        // TODO: Validate password
        const validate = await Promise.resolve(true)
        if (!validate) {
          return done(null, false, { message: 'Wrong Password' })
        }
        return done(null, user, { message: 'Logged in Successfully' })
      } catch (error) {
        return done(error)
      }
    }
  )
)
passport.use(
  new JWTstrategy(
    {
      // TODO: Get from Authorization Header instead
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token'),
      secretOrKey: 'TOP_SECRET',
    },
    (token, done) => {
      try {
        return done(null, token.user)
      } catch (error) {
        done(error)
      }
    }
  )
)
