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
  PayloadArchivist,
  XyoPayloadWithMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner } from '@xyo-network/diviner'
import { XyoPayloadBuilder, XyoPayloads } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBElevationDiviner extends XyoDiviner implements ElevationDiviner, JobProvider {
  constructor(
    @inject(TYPES.Logger) protected readonly logger: Logger,
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(TYPES.PayloadArchivist) protected readonly payloads: PayloadArchivist,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected readonly sdk: BaseMongoSdk<XyoPayloadWithMeta>,
  ) {
    super({ schema: XyoArchivistPayloadDivinerConfigSchema }, account)
  }

  get jobs(): Job[] {
    return [
      {
        name: 'MongoDBElevationDiviner.DivineElevationBatch',
        schedule: '10 minute',
        task: async () => await this.divineElevationBatch(),
      },
    ]
  }

  public async divine(payloads?: XyoPayloads): Promise<XyoPayloads<ElevationPayload>> {
    const query = payloads?.find<ElevationQueryPayload>(isElevationQueryPayload)
    // If this is a query we support
    if (query) {
      // TODO: Extract relevant query values here
      this.logger.log('MongoDBElevationDiviner.Divine: Processing query')
      // Simulating work
      await delay(1)
      this.logger.log('MongoDBElevationDiviner.Divine: Processed query')
      return [new XyoPayloadBuilder<ElevationPayload>({ schema: ElevationSchema }).fields({}).build()]
    }
    // else return empty response
    return []
  }

  override async initialize(): Promise<void> {
    this.logger.log('MongoDBElevationDiviner.Initialize: Initializing')
    // TODO: Any async init here
    await Promise.resolve()
    this.logger.log('MongoDBElevationDiviner.Initialize: Initialized')
  }

  override async shutdown(): Promise<void> {
    this.logger.log('MongoDBElevationDiviner.Shutdown: Shutting down')
    // TODO: Any async shutdown
    await Promise.resolve()
    this.logger.log('MongoDBElevationDiviner.Shutdown: Shutdown')
  }

  private divineElevationBatch = async () => {
    this.logger.log('MongoDBElevationDiviner.DivineElevationBatch: Divining elevations for batch')
    // TODO: Any background/batch processing here
    await Promise.resolve()
    this.logger.log('MongoDBElevationDiviner.DivineElevationBatch: Divined elevations for batch')
  }
}
