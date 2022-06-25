import { XyoArchive, XyoBoundWitnessBuilder, XyoPayloadBuilder, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { AbstractMongoDBPayloadRepository, AbstractMongoDBPayloadRepositoryOpts, getDefaultAbstractMongoDBPayloadRepositoryOpts } from '../../../../lib'

const schema = 'network.xyo.archive'

export class MongoDBArchivePayloadRepository extends AbstractMongoDBPayloadRepository<XyoArchive> {
  constructor(
    protected readonly itemsSdk: BaseMongoSdk<XyoPayloadWithMeta<XyoArchive>>,
    opts: AbstractMongoDBPayloadRepositoryOpts = getDefaultAbstractMongoDBPayloadRepositoryOpts()
  ) {
    super(opts)
  }
  async find(filter: Filter<XyoPayloadWithMeta<XyoArchive>>): Promise<XyoPayloadWithMeta<XyoArchive>[]> {
    return (await this.itemsSdk.find(filter)).toArray()
  }
  async get(name: string): Promise<XyoPayloadWithMeta<XyoArchive>[]> {
    return (await this.itemsSdk.find({ name })).toArray()
  }
  async insert(items: XyoPayloadWithMeta<XyoArchive>[]): Promise<XyoPayloadWithMeta<XyoArchive>[]> {
    const payloads = items.map((i) => new XyoPayloadBuilder<XyoPayloadWithMeta<XyoArchive>>({ schema }).fields(i).build())
    const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payloads(payloads).build()
    const bwResult = await this.boundWitnessSdk.insertOne(bw)
    if (bwResult.acknowledged && bwResult.insertedId) throw new Error('MongoDBPayloadRepository: Error inserting BoundWitness')
    const result = await this.payloadsSdk.insertMany(payloads)
    if (result.insertedCount != payloads.length) throw new Error('MongoDBPayloadRepository: Error inserting Payloads')
    return payloads as XyoPayloadWithMeta<XyoArchive>[]
  }
}
