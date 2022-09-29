import 'reflect-metadata'

import { delay } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import {
  ElevationDiviner,
  ElevationPayload,
  ElevationQueryPayload,
  ElevationSchema,
  isElevationQueryPayload,
  Job,
  JobProvider,
  Logger,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner } from '@xyo-network/diviner'
import { XyoPayload, XyoPayloadBuilder, XyoPayloads } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBArchiveElevationDiviner extends XyoDiviner implements ElevationDiviner, JobProvider {
  constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.Account) account: XyoAccount,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>,
  ) {
    super({ schema: XyoArchivistPayloadDivinerConfigSchema }, account)
  }

  get jobs(): Job[] {
    return [
      {
        name: 'MongoDBArchiveElevationDiviner.DivineElevationBatch',
        schedule: '10 minute',
        task: async () => await this.divineElevationBatch(),
      },
    ]
  }

  public async divine(payloads?: XyoPayloads): Promise<XyoPayloads<ElevationPayload>> {
    const query = payloads?.find<ElevationQueryPayload>(isElevationQueryPayload)
    if (query) {
      // TODO: Extract relevant query values here
      // TODO: Simulate work
      await delay(1)
      return [new XyoPayloadBuilder<ElevationPayload>({ schema: ElevationSchema }).fields({}).build()]
    }
    // Else return empty response?  Ignore request completely?
    return [new XyoPayloadBuilder<ElevationPayload>({ schema: ElevationSchema }).fields({}).build()]
  }

  override async initialize(): Promise<void> {
    // TODO: Any async init here
    await Promise.resolve()
  }

  override async shutdown(): Promise<void> {
    // TODO: Any async shutdown
    await Promise.resolve()
  }

  private divineElevationBatch = async () => {
    // TODO: Background/batch processing here
  }
}
