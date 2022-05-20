import { Request } from 'express'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { getArchiveKeys } from '../../../../lib'
import { getHttpHeader } from './getHttpHeader'

export class ArchiveApiKeyStrategy extends Strategy {
  constructor(public readonly apiKeyHeader = 'x-api-key') {
    super()
  }
  override async authenticate(this: StrategyCreated<this, this & StrategyCreatedStatic>, req: Request, _options?: unknown) {
    try {
      const apiKey = getHttpHeader(this.apiKeyHeader, req)
      if (!apiKey) {
        this.fail('Missing API key in header')
        return
      }

      const { archive } = req.params
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
      const existingArchive = await req.app.archiveRepository.get(archive)
      if (!existingArchive || !existingArchive?.user) {
        this.fail('Invalid user')
        return
      }

      const user = await req.app.userManager.findById(existingArchive.user)
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
