import { Request } from 'express'
import passport, { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

const verifyArchiveOwner = (req: Request): Promise<boolean> => {
  const { user } = req
  if (!user) {
    return Promise.resolve(false)
  }
  const { archive } = req.params
  if (!archive) {
    return Promise.resolve(false)
  }
  // TODO: Verify user owns archive from path
  return Promise.resolve(true)
}

class ArchiveOwnerStrategy extends Strategy {
  constructor() {
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
      const isArchiveOwner = await verifyArchiveOwner(req)
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

export const configureArchiveOwnerStrategy = () => {
  passport.use('archiveOwner', new ArchiveOwnerStrategy())
}
