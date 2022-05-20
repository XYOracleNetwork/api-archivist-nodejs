import { Request } from 'express'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { getArchiveKeys } from '../../../../lib'
import { UserStore } from '../../model'

export class ArchiveApiKeyStrategy extends Strategy {
  constructor(public readonly userStore: UserStore, public readonly apiKeyHeader = 'x-api-key') {
    super()
  }
  override async authenticate(this: StrategyCreated<this, this & StrategyCreatedStatic>, req: Request, _options?: unknown) {
    try {
      // NOTE: There should never be multiple of this header but
      // just to prevent ugliness if someone did send us multiple
      // we'll grab the 1st one
      const apiKey =
        // If the header exists
        req.headers[this.apiKeyHeader]
          ? // If there's multiple of the same header
            Array.isArray(req.headers[this.apiKeyHeader])
            ? // Grab the first one
              (req.headers[this.apiKeyHeader] as string[]).shift()
            : // Otherwise grab the only one
              (req.headers[this.apiKeyHeader] as string)
          : // Otherwise undefined
            undefined
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

      const user = await req.app.userRepository.get(existingArchive.user)
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
