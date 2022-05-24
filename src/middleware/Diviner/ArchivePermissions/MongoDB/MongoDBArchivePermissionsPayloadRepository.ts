import { XyoBoundWitnessBuilder, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { AbstractMongoDBPayloadRepository, AbstractMongoDBPayloadRepositoryOpts, getDefaultAbstractMongoDBPayloadRepositoryOpts } from '../../../../lib'
import { ArchivePermissionsPayload, ArchivePermissionsPayloadSchema } from '../../../../model'

const schema: ArchivePermissionsPayloadSchema = 'network.xyo.security.archive.permissions'

export class MongoDBArchivePermissionsPayloadPayloadRepository extends AbstractMongoDBPayloadRepository<ArchivePermissionsPayload> {
  constructor(protected readonly items: BaseMongoSdk<ArchivePermissionsPayload>, opts: AbstractMongoDBPayloadRepositoryOpts = getDefaultAbstractMongoDBPayloadRepositoryOpts()) {
    super(opts)
  }
  async find(filter: Filter<ArchivePermissionsPayload>): Promise<ArchivePermissionsPayload[]> {
    return (await this.items.find(filter)).toArray()
  }
  async get(archive: string): Promise<ArchivePermissionsPayload[]> {
    return (await this.items.find({ _archive: archive, schema })).sort({ _timestamp: -1 }).limit(1).toArray()
  }
  async insert(items: ArchivePermissionsPayload[]): Promise<ArchivePermissionsPayload[]> {
    const payloads = items.map((i) => new XyoPayloadBuilder({ schema }).fields({ i }).build())
    const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payloads(payloads).build()
    const bwResult = await this.boundWitnessSdk.insertOne(bw)
    if (bwResult.acknowledged && bwResult.insertedId) throw new Error('MongoDBArchivePermissionsPayloadPayloadRepository: Error inserting BoundWitness')
    const result = await this.payloadsSdk.insertMany(payloads)
    if (result.insertedCount != payloads.length) throw new Error('MongoDBArchivePermissionsPayloadPayloadRepository: Error inserting Payloads')
    return payloads as ArchivePermissionsPayload[]
  }
}
