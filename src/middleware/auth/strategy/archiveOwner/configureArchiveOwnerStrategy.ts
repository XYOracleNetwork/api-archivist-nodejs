import passport from 'passport'

import { IArchiveOwnerStore } from '../../model'
import { ArchiveOwnerStrategy } from './archiveOwnerStrategy'

export const ARCHIVE_OWNER_STRATEGY_NAME = 'archiveOwner'
export const archiveOwnerStrategy = passport.authenticate(ARCHIVE_OWNER_STRATEGY_NAME, { session: false })

export const configureArchiveOwnerStrategy = (store: IArchiveOwnerStore) => {
  passport.use(ARCHIVE_OWNER_STRATEGY_NAME, new ArchiveOwnerStrategy(store))
}
