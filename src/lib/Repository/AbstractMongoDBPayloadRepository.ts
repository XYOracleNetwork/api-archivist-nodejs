import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilderConfig, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { AbstractPayloadRepository } from '../../model'
import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../dbSdk'

export interface AbstractMongoDBPayloadRepositoryOpts {
  account: XyoAccount
  boundWitnessSdk: BaseMongoSdk<XyoBoundWitness>
  config: XyoBoundWitnessBuilderConfig
  payloadsSdk: BaseMongoSdk<XyoPayload>
}

export const getDefaultAbstractMongoDBPayloadRepositoryOpts = (): AbstractMongoDBPayloadRepositoryOpts => {
  return {
    account: XyoAccount.random(),
    boundWitnessSdk: getArchivistAllBoundWitnessesMongoSdk(),
    config: { inlinePayloads: false },
    payloadsSdk: getArchivistAllPayloadMongoSdk(),
  }
}

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
