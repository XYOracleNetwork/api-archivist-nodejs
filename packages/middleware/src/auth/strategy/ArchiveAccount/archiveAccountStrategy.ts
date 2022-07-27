import { NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { ArchiveLocals, ArchivePathParams } from '@xyo-network/archivist-model'
import { XyoBoundWitnessWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { verifyOperationAllowedByAddress } from './verifyOperationAllowedByAddress'

export class ArchiveAccountStrategy extends Strategy {
  constructor() {
    super()
  }
  override async authenticate(
    this: StrategyCreated<this, this & StrategyCreatedStatic>,
    req: Request<ArchivePathParams, unknown, XyoBoundWitnessWithMeta[], NoReqQuery, ArchiveLocals>,
    _options?: unknown
  ) {
    try {
      const allowed = await verifyOperationAllowedByAddress(req)
      if (!allowed) {
        this.fail('Account not authorized for operation on this archive', StatusCodes.FORBIDDEN)
        return
      }
      this.success(req?.user || {})
      return
    } catch (error) {
      this.error({ message: 'ArchiveAccountStrategy Auth Error' })
    }
  }
}