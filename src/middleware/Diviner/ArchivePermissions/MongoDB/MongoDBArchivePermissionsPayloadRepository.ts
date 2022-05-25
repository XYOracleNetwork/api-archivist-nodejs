import { XyoBoundWitnessBuilder, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import {
  AbstractMongoDBPayloadRepository,
  AbstractMongoDBPayloadRepositoryOpts,
  getArchivistBoundWitnessesMongoSdk,
  getArchivistPayloadMongoSdk,
  getBaseMongoSdk,
  getDefaultAbstractMongoDBPayloadRepositoryOpts,
} from '../../../../lib'
import { SetArchivePermissionsPayload, SetArchivePermissionsSchema, setArchivePermissionsSchema } from '../../../../model'

const schema: SetArchivePermissionsSchema = setArchivePermissionsSchema

export class MongoDBArchivePermissionsPayloadPayloadRepository extends AbstractMongoDBPayloadRepository<SetArchivePermissionsPayload> {
  constructor(
    protected readonly items: BaseMongoSdk<SetArchivePermissionsPayload> = getBaseMongoSdk('payload'),
    opts: AbstractMongoDBPayloadRepositoryOpts = getDefaultAbstractMongoDBPayloadRepositoryOpts()
  ) {
    super(opts)
  }
  async find(filter: Filter<SetArchivePermissionsPayload>): Promise<SetArchivePermissionsPayload[]> {
    return (await this.items.find(filter)).toArray()
  }
  async get(archive: string): Promise<SetArchivePermissionsPayload[]> {
    return (await getArchivistPayloadMongoSdk(archive).find({ _archive: archive, schema })).sort({ _timestamp: -1 }).limit(1).toArray() as unknown as SetArchivePermissionsPayload[]
  }
  async insert(items: SetArchivePermissionsPayload[]): Promise<SetArchivePermissionsPayload[]> {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const archive = item._archive
      if (archive) {
        const payload = new XyoPayloadBuilder({ schema }).fields(item).build()
        const payloadResult = await getArchivistPayloadMongoSdk(archive).insertOne(payload)
        if (!payloadResult.acknowledged || !payloadResult.insertedId) throw new Error('MongoDBArchivePermissionsPayloadPayloadRepository: Error inserting Payload')
        const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payload(payload).build()
        const bwResult = await getArchivistBoundWitnessesMongoSdk(archive).insertOne(bw)
        if (!bwResult.acknowledged || !bwResult.insertedId) throw new Error('MongoDBArchivePermissionsPayloadPayloadRepository: Error inserting BoundWitness')
      }
    }
    return items
  }
}
