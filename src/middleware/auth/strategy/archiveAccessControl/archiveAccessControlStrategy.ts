import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { verifyArchiveAccess } from './verifyArchiveAccess'

export class ArchiveOwnerStrategy extends Strategy {
  constructor() {
    super()
  }
  override async authenticate(
    this: StrategyCreated<this, this & StrategyCreatedStatic>,
    req: Request,
    _options?: unknown
  ) {
    try {
      const canAccessArchive = await verifyArchiveAccess(req)
      if (!canAccessArchive) {
        this.fail('User not authorized for archive', StatusCodes.FORBIDDEN)
        return
      }
      this.success({})
      return
    } catch (error) {
      this.error({ message: 'ArchiveOwner Auth Error' })
    }
  }
}
