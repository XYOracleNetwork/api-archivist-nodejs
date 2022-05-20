import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilderConfig, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { AbstractPayloadRepository } from '../../model'
import { AbstractMongoDBPayloadRepositoryOpts } from './AbstractMongoDBPayloadRepositoryOpts'
import { getDefaultAbstractMongoDBPayloadRepositoryOpts } from './getDefaultAbstractMongoDBPayloadRepositoryOpts'

export abstract class AbstractMongoDBPayloadRepository<T, TId = string, TQuery = Filter<T>> extends AbstractPayloadRepository<T, TId, TQuery> {
  protected readonly account: XyoAccount
  protected readonly boundWitnessSdk: BaseMongoSdk<XyoBoundWitness>
  protected readonly config: XyoBoundWitnessBuilderConfig
  protected readonly payloadsSdk: BaseMongoSdk<XyoPayload>

  protected constructor(opts: AbstractMongoDBPayloadRepositoryOpts = getDefaultAbstractMongoDBPayloadRepositoryOpts()) {
    super()
    this.account = opts.account
    this.boundWitnessSdk = opts.boundWitnessSdk
    this.config = opts.config
    this.payloadsSdk = opts.payloadsSdk
  }
}
