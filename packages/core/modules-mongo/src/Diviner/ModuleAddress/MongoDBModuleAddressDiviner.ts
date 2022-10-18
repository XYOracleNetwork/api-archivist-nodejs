import 'reflect-metadata'

import { delay } from '@xylabs/delay'
import { XyoAccount } from '@xyo-network/account'
import {
  isModuleAddressQueryPayload,
  ModuleAddressDiviner,
  ModuleAddressPayload,
  ModuleAddressQueryPayload,
  ModuleAddressSchema,
  PayloadArchivist,
  XyoPayloadWithMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner } from '@xyo-network/diviner'
import { XyoPayloadBuilder, XyoPayloads } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Job, JobProvider, Logger } from '@xyo-network/shared'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBModuleAddressDiviner extends XyoDiviner implements ModuleAddressDiviner, JobProvider {
  constructor(
    @inject(TYPES.Logger) public readonly logger: Logger,
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(TYPES.PayloadArchivist) protected readonly payloads: PayloadArchivist,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected readonly sdk: BaseMongoSdk<XyoPayloadWithMeta>,
  ) {
    super({ schema: XyoArchivistPayloadDivinerConfigSchema }, account)
  }

  get jobs(): Job[] {
    return [
      {
        name: 'MongoDBModuleAddressDiviner.DivineAddressBatch',
        schedule: '10 minute',
        task: async () => await this.divineModuleAddressBatch(),
      },
    ]
  }

  public async divine(payloads?: XyoPayloads): Promise<XyoPayloads<ModuleAddressPayload>> {
    const query = payloads?.find<ModuleAddressQueryPayload>(isModuleAddressQueryPayload)
    // If this is a query we support
    if (query) {
      // TODO: Extract relevant query values here
      this.logger.log('MongoDBModuleAddressDiviner.Divine: Processing query')
      // Simulating work
      await delay(1)
      this.logger.log('MongoDBModuleAddressDiviner.Divine: Processed query')
      return [new XyoPayloadBuilder<ModuleAddressPayload>({ schema: ModuleAddressSchema }).fields({}).build()]
    }
    // else return empty response
    return []
  }

  override async initialize(): Promise<void> {
    this.logger.log('MongoDBModuleAddressDiviner.Initialize: Initializing')
    // TODO: Any async init here
    await Promise.resolve()
    this.logger.log('MongoDBModuleAddressDiviner.Initialize: Initialized')
  }

  override async shutdown(): Promise<void> {
    this.logger.log('MongoDBModuleAddressDiviner.Shutdown: Shutting down')
    // TODO: Any async shutdown
    await Promise.resolve()
    this.logger.log('MongoDBModuleAddressDiviner.Shutdown: Shutdown')
  }

  private divineModuleAddressBatch = async () => {
    this.logger.log('MongoDBModuleAddressDiviner.DivineModuleAddressBatch: Divining elevations for batch')
    // TODO: Any background/batch processing here
    await Promise.resolve()
    this.logger.log('MongoDBModuleAddressDiviner.DivineModuleAddressBatch: Divined elevations for batch')
  }
}
