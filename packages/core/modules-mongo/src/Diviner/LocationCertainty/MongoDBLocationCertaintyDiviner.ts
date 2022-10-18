import 'reflect-metadata'

import { XyoAccount } from '@xyo-network/account'
import { LocationCertaintyDivinerConfigSchema, LocationCertaintySchema } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { LocationCertaintyDiviner } from '@xyo-network/location-certainty-payload-plugin'
import { JobProvider, Logger } from '@xyo-network/shared'
import { inject, injectable } from 'inversify'

@injectable()
export class MongoDBLocationCertaintyDiviner extends LocationCertaintyDiviner implements LocationCertaintyDiviner, JobProvider {
  constructor(@inject(TYPES.Logger) logger: Logger, @inject(TYPES.Account) protected readonly account: XyoAccount) {
    super({ account, config: { schema: LocationCertaintyDivinerConfigSchema, targetSchema: LocationCertaintySchema }, logger })
  }
}
