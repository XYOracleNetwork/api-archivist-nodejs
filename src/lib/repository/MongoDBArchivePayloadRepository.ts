import { XyoAccount, XyoArchive, XyoBoundWitness, XyoBoundWitnessBuilder, XyoBoundWitnessBuilderConfig, XyoPayload, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../dbSdk'
import { AbstractMongoDBPayloadRepository } from './AbstractMongoDBPayloadRepository'
import { ArchivePayloadRepository } from './ArchivePayloadRepository'

// TODO: Let base expose raw payload SDK
// TODO: Consumers can get a wrapped version of it that is strongly typed to their native object based on schema

export class MongoDBArchivePayloadRepository
  extends AbstractMongoDBPayloadRepository<XyoArchive, XyoArchive, Filter<XyoArchive>, string, 'network.xyo.archive'>
  implements ArchivePayloadRepository<Filter<XyoArchive>>
{
  constructor(
    protected readonly itemsSdk: BaseMongoSdk<XyoArchive>,
    payloadsSdk: BaseMongoSdk<XyoPayload> = getArchivistAllPayloadMongoSdk(),
    boundWitnessSdk: BaseMongoSdk<XyoBoundWitness> = getArchivistAllBoundWitnessesMongoSdk(),
    account: XyoAccount = XyoAccount.random(),
    config: XyoBoundWitnessBuilderConfig = { inlinePayloads: false }
  ) {
    super(payloadsSdk, boundWitnessSdk, account, config)
  }
  async find(filter: Filter<XyoArchive>): Promise<XyoArchive[]> {
    return (await this.itemsSdk.find(filter)).toArray()
  }
  async get(name: string): Promise<XyoArchive[]> {
    return (await this.itemsSdk.find({ name })).toArray()
  }
  async insert(items: XyoArchive[]): Promise<XyoArchive[]> {
    const schema = 'TODO: T'
    const payloads = items.map((i) => new XyoPayloadBuilder({ schema }).fields({ i }).build())
    const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payloads(payloads).build()
    const bwResult = await this.boundWitnessSdk.insertOne(bw)
    if (bwResult.acknowledged && bwResult.insertedId) throw new Error('MongoDBPayloadRepository: Error inserting BoundWitness')
    const result = await this.payloadsSdk.insertMany(payloads)
    if (result.insertedCount != payloads.length) throw new Error('MongoDBPayloadRepository: Error inserting Payloads')
    return items
  }
}
