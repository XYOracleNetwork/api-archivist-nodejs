import { NoReqBody, NoReqQuery, NoResBody } from '@xylabs/sdk-api-express-ecs'
import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { ArchiveLocals, ArchivePathParams } from '../../../../archive'
import { isRequestUserOwnerOfRequestedArchive } from '../../../../lib'
import { isPublicArchive } from './isPublicArchive'

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
      // If it's not a public archive
      if (!isPublicArchive(req)) {
        // We require auth
        if (!req?.user?.id) {
          this.fail('Archive requires authorization', StatusCodes.UNAUTHORIZED)
          return
        } else {
          // Check if user has access to this archive
          if (!isRequestUserOwnerOfRequestedArchive(req)) {
            this.fail('User not authorized for archive', StatusCodes.FORBIDDEN)
            return
          }
        }
      }
      this.success(req.user || {})
      return
    } catch (error) {
      this.error({ message: 'ArchiveOwner Auth Error' })
    }
  }
}
