import { XyoBoundWitnessBuilder, XyoPayload, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { AbstractMongoDBPayloadRepository, AbstractMongoDBPayloadRepositoryOpts, getDefaultAbstractMongoDBPayloadRepositoryOpts } from '../../../../lib'
import { ArchivePermissions } from '../ArchivePermissions'

const schema = 'network.xyo.archive'

export class MongoDBArchivePermissionsPayloadRepository extends AbstractMongoDBPayloadRepository<ArchivePermissions> {
  constructor(
    protected readonly itemsSdk: BaseMongoSdk<XyoPayload<ArchivePermissions>>,
    opts: AbstractMongoDBPayloadRepositoryOpts = getDefaultAbstractMongoDBPayloadRepositoryOpts()
  ) {
    super(opts)
  }
  async find(filter: Filter<XyoPayload<ArchivePermissions>>): Promise<XyoPayload<ArchivePermissions>[]> {
    return (await this.itemsSdk.find(filter)).toArray()
  }
  async get(name: string): Promise<XyoPayload<ArchivePermissions>[]> {
    return (await this.itemsSdk.find({ name })).toArray()
  }
  async insert(items: ArchivePermissions[]): Promise<XyoPayload<ArchivePermissions>[]> {
    const payloads = items.map((i) => new XyoPayloadBuilder({ schema }).fields({ i }).build())
    const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payloads(payloads).build()
    const bwResult = await this.boundWitnessSdk.insertOne(bw)
    if (bwResult.acknowledged && bwResult.insertedId) throw new Error('MongoDBPayloadRepository: Error inserting BoundWitness')
    const result = await this.payloadsSdk.insertMany(payloads)
    if (result.insertedCount != payloads.length) throw new Error('MongoDBPayloadRepository: Error inserting Payloads')
    return payloads as XyoPayload<ArchivePermissions>[]
  }
}
