import 'reflect-metadata'

import { delay } from '@xylabs/delay'
import { XyoAccount } from '@xyo-network/account'
import {
  ArchiveArchivist,
  isModuleAddressQueryPayload,
  ModuleAddressDiviner,
  ModuleAddressPayload,
  ModuleAddressQueryPayload,
  ModuleAddressSchema,
  XyoBoundWitnessWithMeta,
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
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(TYPES.ArchiveArchivist) protected readonly archives: ArchiveArchivist,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly boundWitnesses: BaseMongoSdk<XyoBoundWitnessWithMeta>,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected readonly payloads: BaseMongoSdk<XyoPayloadWithMeta>,
  ) {
    super({ account, config: { schema: XyoArchivistPayloadDivinerConfigSchema }, logger })
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
      this.logger?.log('MongoDBModuleAddressDiviner.Divine: Processing query')
      // Simulating work
      await delay(1)
      this.logger?.log('MongoDBModuleAddressDiviner.Divine: Processed query')
      return [new XyoPayloadBuilder<ModuleAddressPayload>({ schema: ModuleAddressSchema }).fields({}).build()]
    }
    // else return empty response
    return []
  }

  override async start(): Promise<typeof this> {
    // await this.registerWithChangeStream()
    return await super.start()
  }

  override async stop(): Promise<typeof this> {
    // await this.changeStream?.close()
    return await super.stop()
  }

  private divineModuleAddressBatch = async () => {
    this.logger.log('MongoDBModuleAddressDiviner.DivineModuleAddressBatch: Divining addresses for batch')
    // TODO: Any background/batch processing here
    await Promise.resolve()
    this.logger.log('MongoDBModuleAddressDiviner.DivineModuleAddressBatch: Divined addresses for batch')
  }
}
