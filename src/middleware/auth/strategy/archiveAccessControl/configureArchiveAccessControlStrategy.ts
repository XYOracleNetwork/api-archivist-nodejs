import passport from 'passport'

import { ArchiveOwnerStrategy } from './archiveAccessControlStrategy'

export const archiveAccessControlStrategyName = 'archiveOwner'
export const archiveAccessControlStrategy = passport.authenticate(archiveAccessControlStrategyName, { session: false })

export const configureArchiveAccessControlStrategy = () => {
  passport.use(archiveAccessControlStrategyName, new ArchiveOwnerStrategy())
}
