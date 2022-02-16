import passport from 'passport'

import { ArchiveOwnerStrategy } from './archiveOwnerStrategy'

export const archiveOwnerStrategyName = 'archiveOwner'
export const archiveOwnerStrategy = passport.authenticate(archiveOwnerStrategyName, { session: false })

export const configureArchiveOwnerStrategy = () => {
  passport.use(archiveOwnerStrategyName, new ArchiveOwnerStrategy())
}
