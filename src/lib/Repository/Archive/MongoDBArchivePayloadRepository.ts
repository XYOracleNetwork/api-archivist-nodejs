import { XyoAccount, XyoArchive, XyoBoundWitness, XyoBoundWitnessBuilder, XyoBoundWitnessBuilderConfig, XyoPayload, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { XyoStoredPayload } from '../../../model'
import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../../dbSdk'
import { AbstractMongoDBPayloadRepository } from '../AbstractMongoDBPayloadRepository'

const schema = 'network.xyo.archive'
export class MongoDBArchivePayloadRepository extends AbstractMongoDBPayloadRepository<XyoArchive, XyoStoredPayload<XyoArchive>, string, Filter<XyoStoredPayload<XyoArchive>>> {
  constructor(
    protected readonly itemsSdk: BaseMongoSdk<XyoStoredPayload<XyoArchive>>,
    payloadsSdk: BaseMongoSdk<XyoPayload> = getArchivistAllPayloadMongoSdk(),
    boundWitnessSdk: BaseMongoSdk<XyoBoundWitness> = getArchivistAllBoundWitnessesMongoSdk(),
    account: XyoAccount = XyoAccount.random(),
    config: XyoBoundWitnessBuilderConfig = { inlinePayloads: false }
  ) {
    super(payloadsSdk, boundWitnessSdk, account, config)
  }
  async find(filter: Filter<XyoStoredPayload<XyoArchive>>): Promise<XyoStoredPayload<XyoArchive>[]> {
    return (await this.itemsSdk.find(filter)).toArray()
  }
  async get(name: string): Promise<XyoStoredPayload<XyoArchive>[]> {
    return (await this.itemsSdk.find({ name })).toArray()
  }
  async insert(items: XyoArchive[]): Promise<XyoStoredPayload<XyoArchive>[]> {
    const payloads = items.map((i) => new XyoPayloadBuilder({ schema }).fields({ i }).build())
    const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payloads(payloads).build()
    const bwResult = await this.boundWitnessSdk.insertOne(bw)
    if (bwResult.acknowledged && bwResult.insertedId) throw new Error('MongoDBPayloadRepository: Error inserting BoundWitness')
    const result = await this.payloadsSdk.insertMany(payloads)
    if (result.insertedCount != payloads.length) throw new Error('MongoDBPayloadRepository: Error inserting Payloads')
    return payloads as XyoStoredPayload<XyoArchive>[]
  }
}
