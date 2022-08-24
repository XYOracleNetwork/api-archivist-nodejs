import 'reflect-metadata'

import { AbstractPayloadArchivist } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoAccount, XyoBoundWitnessBuilderConfig, XyoBoundWitnessWithMeta, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../types'

@injectable()
export abstract class AbstractMongoDBPayloadArchivist<T extends object, TId = string> extends AbstractPayloadArchivist<T, TId> {
  protected readonly config: XyoBoundWitnessBuilderConfig = { inlinePayloads: false }

  public constructor(
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected readonly payloads: BaseMongoSdk<XyoPayloadWithMeta<T>>,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly boundWitnesses: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super()
  }

  // public abstract get schema(): string
}
