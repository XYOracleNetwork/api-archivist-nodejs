import 'reflect-metadata'

import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilderConfig, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { injectable } from 'inversify'
import { Filter } from 'mongodb'

import { AbstractPayloadArchivist } from '../../model'
import { AbstractMongoDBPayloadArchivistOpts } from './AbstractMongoDBPayloadRepositoryOpts'
import { getDefaultAbstractMongoDBPayloadArchivistOpts } from './getDefaultAbstractMongoDBPayloadRepositoryOpts'

@injectable()
export abstract class AbstractMongoDBPayloadArchivist<T extends object, TId = string, TQuery = Filter<T>> extends AbstractPayloadArchivist<T, TId, TQuery> {
  protected readonly account: XyoAccount
  protected readonly boundWitnessSdk: BaseMongoSdk<XyoBoundWitness>
  protected readonly config: XyoBoundWitnessBuilderConfig
  protected readonly payloadsSdk: BaseMongoSdk<XyoPayload>

  public constructor() {
    super()
    const opts: AbstractMongoDBPayloadArchivistOpts = getDefaultAbstractMongoDBPayloadArchivistOpts()
    this.account = opts.account
    this.boundWitnessSdk = opts.boundWitnessSdk
    this.config = opts.config
    this.payloadsSdk = opts.payloadsSdk
  }
}
