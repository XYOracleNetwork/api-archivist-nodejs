import { Request } from 'express'
import passport, { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { IArchiveOwnerStore } from '../model'

const verifyArchiveOwner = async (req: Request, store: IArchiveOwnerStore): Promise<boolean> => {
  // Validate user from request
  const { user } = req
  if (!user || !user?.id) {
    return Promise.resolve(false)
  }
  // Validate archive from request
  const { archive } = req.params
  if (!archive) {
    return Promise.resolve(false)
  }
  // Get archives owned by the user
  const userArchives = await store.getArchivesOwnedByUser(user.id)
  // Verify user owns archive from path
  return userArchives.some((userArchive) => userArchive === archive)
}

class ArchiveOwnerStrategy extends Strategy {
  constructor(public readonly store: IArchiveOwnerStore) {
    super()
  }
  override async authenticate(
    this: StrategyCreated<this, this & StrategyCreatedStatic>,
    req: Request,
    _options?: unknown
  ) {
    try {
      const { user } = req
      if (!user) {
        this.fail('Invalid user')
        return
      }
      const isArchiveOwner = await verifyArchiveOwner(req, this.store)
      if (!isArchiveOwner) {
        this.fail('User not authorized for archive')
        return
      }
      this.success(user)
      return
    } catch (error) {
      this.error({ message: 'Web3 Auth Error' })
    }
  }
}

export const configureArchiveOwnerStrategy = (store: IArchiveOwnerStore) => {
  passport.use('archiveOwner', new ArchiveOwnerStrategy(store))
}
