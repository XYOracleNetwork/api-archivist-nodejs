import passport from 'passport'

import { ArchiveAccountStrategy } from './archiveAccountStrategy'

export const archiveAccountStrategyName = 'archiveAccount'
export const archiveAccountStrategy = passport.authenticate(archiveAccountStrategyName, { session: false })

export const configureArchiveAccountStrategy = () => {
  passport.use(archiveAccountStrategyName, new ArchiveAccountStrategy())
}
