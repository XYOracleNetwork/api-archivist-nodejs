import passport from 'passport'

import { IArchiveOwnerStore } from '../../model'
import { ArchiveOwnerStrategy } from './archiveOwnerStrategy'

export const configureArchiveOwnerStrategy = (store: IArchiveOwnerStore) => {
  passport.use('archiveOwner', new ArchiveOwnerStrategy(store))
}
