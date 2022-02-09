import { Request } from 'express'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { getArchiveKeys, getArchiveOwnerMongoSdk } from '../../../../lib'
import { IUserStore } from '../../model'

export class ArchiveApiKeyStrategy extends Strategy {
  constructor(public readonly userStore: IUserStore, public readonly apiKeyHeader = 'x-api-key') {
    super()
  }
  override async authenticate(
    this: StrategyCreated<this, this & StrategyCreatedStatic>,
    req: Request,
    _options?: unknown
  ) {
    try {
      // TODO: Don't just cast here
      const apiKey = req.headers[this.apiKeyHeader] as string
      if (!apiKey) {
        this.fail('Missing API key in header')
        return
      }

      const archive = req.params.archive
      if (!archive) {
        this.fail('Invalid archive')
        return
      }

      // Validate API Key is valid for this archive
      const result = await getArchiveKeys(archive)
      const keys = result.map((key) => key.key)
      if (!keys.includes(apiKey)) {
        this.fail('Invalid API key')
        return
      }

      // Get the archive owner
      const owners = await getArchiveOwnerMongoSdk()
      const archiveOwner = await owners.findByArchive(archive)
      if (!archiveOwner || !archiveOwner?.user) {
        this.fail('Invalid user')
        return
      }

      const user = await this.userStore.getById(archiveOwner.user)
      if (!user) {
        this.fail('Invalid user')
        return
      }
      this.success(user)
      return
    } catch (error) {
      this.error({ message: 'Archive API Key Auth Error' })
    }
  }
}
