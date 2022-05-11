import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilder, XyoBoundWitnessBuilderConfig, XyoPayload, XyoPayloadBody } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { PayloadRepository } from '../../model'
import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../dbSdk'

export class MongoDBPayloadRepository implements PayloadRepository<XyoPayloadBody, XyoPayload, Filter<XyoPayload>> {
  constructor(
    private readonly payloadsSdk: BaseMongoSdk<XyoPayload> = getArchivistAllPayloadMongoSdk(),
    private readonly boundWitnessSdk: BaseMongoSdk<XyoBoundWitness> = getArchivistAllBoundWitnessesMongoSdk(),
    private readonly account: XyoAccount = XyoAccount.random(),
    private readonly config: XyoBoundWitnessBuilderConfig = { inlinePayloads: false }
  ) {}
  async find(filter: Filter<XyoPayload>): Promise<XyoPayload[]> {
    return (await this.payloadsSdk.find(filter)).toArray()
  }
  async get(huri: string): Promise<XyoPayload[]> {
    return (await this.payloadsSdk.find({ _hash: huri })).toArray()
  }
  async insert(payloads: XyoPayloadBody[]): Promise<XyoPayload[]> {
    const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payloads(payloads).build()
    const bwResult = await this.boundWitnessSdk.insertOne(bw)
    if (bwResult.acknowledged && bwResult.insertedId) throw new Error('Error inserting payloads')
    // TODO: Validate payloads before insert?
    const result = await this.payloadsSdk.insertMany(payloads)
    if (result.insertedCount != payloads.length) throw new Error('Error inserting payloads')
    return payloads
  }
}
