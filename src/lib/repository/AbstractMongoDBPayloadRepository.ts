import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilderConfig, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'

import { AbstractPayloadRepository, XyoStoredPayload } from '../../model'
import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../dbSdk'

export abstract class AbstractMongoDBPayloadRepository<
  TInsert,
  TResponse extends XyoStoredPayload<TInsert>,
  TQuery,
  TId,
  TSchema extends string = string
> extends AbstractPayloadRepository<TInsert, TResponse, TQuery, TId, TSchema> {
  protected constructor(
    protected readonly payloadsSdk: BaseMongoSdk<XyoPayload> = getArchivistAllPayloadMongoSdk(),
    protected readonly boundWitnessSdk: BaseMongoSdk<XyoBoundWitness> = getArchivistAllBoundWitnessesMongoSdk(),
    protected readonly account: XyoAccount = XyoAccount.random(),
    protected readonly config: XyoBoundWitnessBuilderConfig = { inlinePayloads: false }
  ) {
    super()
  }
}
