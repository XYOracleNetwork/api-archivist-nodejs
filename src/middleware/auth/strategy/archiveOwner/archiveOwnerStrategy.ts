import { Request } from 'express'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { IArchiveOwnerStore } from '../../model'
import { verifyArchiveOwner } from './verifyArchiveOwner'

export class ArchiveOwnerStrategy extends Strategy {
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
      this.error({ message: 'ArchiveOwner Auth Error' })
    }
  }
}
