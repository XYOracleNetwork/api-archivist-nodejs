import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilderConfig, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { AbstractPayloadRepository } from '../../model'
import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../dbSdk'

export abstract class AbstractMongoDBPayloadRepository<T, TId = string, TQuery = Filter<T>> extends AbstractPayloadRepository<T, TId, TQuery> {
  protected constructor(
    protected readonly payloadsSdk: BaseMongoSdk<XyoPayload> = getArchivistAllPayloadMongoSdk(),
    protected readonly boundWitnessSdk: BaseMongoSdk<XyoBoundWitness> = getArchivistAllBoundWitnessesMongoSdk(),
    protected readonly account: XyoAccount = XyoAccount.random(),
    protected readonly config: XyoBoundWitnessBuilderConfig = { inlinePayloads: false }
  ) {
    super()
  }
}
