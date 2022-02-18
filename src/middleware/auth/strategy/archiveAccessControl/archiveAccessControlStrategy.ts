import { NoReqBody, NoReqQuery, NoResBody } from '@xylabs/sdk-api-express-ecs'
import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { ArchiveLocals, ArchivePathParams } from '../../../../archive'
import { verifyArchiveAccess } from './verifyArchiveAccess'

export class ArchiveOwnerStrategy extends Strategy {
  constructor() {
    super()
  }
  override authenticate(
    this: StrategyCreated<this, this & StrategyCreatedStatic>,
    req: Request<ArchivePathParams, NoResBody, NoReqBody, NoReqQuery, ArchiveLocals>,
    _options?: unknown
  ) {
    try {
      const canAccessArchive = verifyArchiveAccess(req)
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
