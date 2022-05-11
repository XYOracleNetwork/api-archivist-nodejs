import { WithXyoPayloadMeta, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { PayloadRepository } from '../../model'
import { getArchivistAllPayloadMongoSdk } from '../dbSdk'

export class MongoDBPayloadRepository implements PayloadRepository<XyoPayload, Filter<XyoPayload>> {
  constructor(
    private readonly sdk: BaseMongoSdk<XyoPayload> = getArchivistAllPayloadMongoSdk() /*
    private readonly account: XyoAccount = XyoAccount.random(),
    private readonly config: XyoBoundWitnessBuilderConfig = { inlinePayloads: false }
    */
  ) {}
  async find(filter: Filter<XyoPayload>): Promise<WithXyoPayloadMeta<XyoPayload>[]> {
    return (await this.sdk.find(filter)).toArray()
  }
  async get(huri: string): Promise<WithXyoPayloadMeta<XyoPayload>[]> {
    return (await this.sdk.find({ _hash: huri })).toArray()
  }
  async insert(payloads: XyoPayload[]): Promise<WithXyoPayloadMeta<XyoPayload>[]> {
    // TODO: Witness before insert?
    // TODO: Validate payloads before insert?
    const result = await this.sdk.insertMany(payloads)
    if (result.insertedCount != payloads.length) throw new Error('Error inserting payloads')
    return payloads
  }
}
