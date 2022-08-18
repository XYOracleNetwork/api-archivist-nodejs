import 'reflect-metadata'

import { AbstractPayloadArchivist } from '@xyo-network/archivist-model'
import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilderConfig, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { injectable } from 'inversify'

import { AbstractMongoDBPayloadArchivistOpts } from './AbstractMongoDBPayloadArchivistOpts'
import { getDefaultAbstractMongoDBPayloadArchivistOpts } from './getDefaultAbstractMongoDBPayloadArchivistOpts'

@injectable()
export abstract class AbstractMongoDBPayloadArchivist<T extends object, TId = string> extends AbstractPayloadArchivist<T, TId> {
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
