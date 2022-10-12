import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import {
  BoundWitnessDiviner,
  BoundWitnessQueryPayload,
  isBoundWitnessQueryPayload,
  Job,
  JobProvider,
  Logger,
  XyoBoundWitnessWithMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner } from '@xyo-network/diviner'
import { XyoPayloads } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { COLLECTIONS } from '../../collections'
import { DATABASES } from '../../databases'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBBoundWitnessDiviner extends XyoDiviner implements BoundWitnessDiviner, JobProvider {
  constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.Account) account: XyoAccount,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super({ schema: XyoArchivistPayloadDivinerConfigSchema }, account)
  }

  get jobs(): Job[] {
    return [
      // {
      //   name: 'MongoDBBoundWitnessDiviner.DivineBatch',
      //   schedule: '10 minute',
      //   task: async () => await this.divineArchivesBatch(),
      // },
    ]
  }

  override divine(payloads?: XyoPayloads): Promise<XyoPayloads<XyoBoundWitness>> {
    const query = payloads?.find<BoundWitnessQueryPayload>(isBoundWitnessQueryPayload)
    const archive = assertEx(query?.archive, 'Query missing archive')
    return Promise.resolve([])
  }

  override async initialize(): Promise<void> {
    // await this.registerWithChangeStream()
  }

  override async shutdown(): Promise<void> {
    // await this.changeStream?.close()
  }
}
