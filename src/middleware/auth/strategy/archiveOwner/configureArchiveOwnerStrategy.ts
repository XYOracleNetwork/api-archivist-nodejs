import passport from 'passport'

import { IArchiveOwnerStore } from '../../model'
import { ArchiveOwnerStrategy } from './archiveOwnerStrategy'

export const archiveOwnerStrategyName = 'archiveOwner'
export const archiveOwnerStrategy = passport.authenticate(archiveOwnerStrategyName, { session: false })

export const configureArchiveOwnerStrategy = (store: IArchiveOwnerStore) => {
  passport.use(archiveOwnerStrategyName, new ArchiveOwnerStrategy(store))
}
