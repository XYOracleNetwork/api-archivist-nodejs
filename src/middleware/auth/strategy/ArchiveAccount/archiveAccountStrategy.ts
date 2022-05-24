import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { verifyOperationAllowedByAddress } from './verifyOperationAllowedByAddress'

export class ArchiveAccountStrategy extends Strategy {
  constructor() {
    super()
  }
  override async authenticate(this: StrategyCreated<this, this & StrategyCreatedStatic>, req: Request, _options?: unknown) {
    try {
      const { user } = req
      if (!user) {
        this.fail('Invalid user')
        return
      }
      const allowed = await verifyOperationAllowedByAddress(req)
      if (!allowed) {
        this.fail('Account not authorized for operation on this archive', StatusCodes.FORBIDDEN)
        return
      }
      this.success(user)
      return
    } catch (error) {
      this.error({ message: 'ArchiveAccountStrategy Auth Error' })
    }
  }
}
