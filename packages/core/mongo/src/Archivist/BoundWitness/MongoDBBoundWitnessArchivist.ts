import { AbstractBoundWitnessArchivist } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoBoundWitnessWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter } from 'mongodb'

@injectable()
export class MongoDBBoundWitnessArchivist extends AbstractBoundWitnessArchivist<XyoBoundWitnessWithMeta, string, Filter<XyoBoundWitnessWithMeta>> {
  constructor(@inject(TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>) {
    super()
  }
  async find(filter: Filter<XyoBoundWitnessWithMeta>): Promise<XyoBoundWitnessWithMeta[]> {
    return (await this.sdk.find(filter)).limit(100).toArray()
  }
  async get(hash: string): Promise<XyoBoundWitnessWithMeta[]> {
    return (await this.sdk.find({ _hash: hash })).limit(100).toArray()
  }
  async insert(items: XyoBoundWitnessWithMeta[]): Promise<XyoBoundWitnessWithMeta[]> {
    // TODO: Remove _id if present
    const result = await this.sdk.insertMany(items)
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting Payloads')
    }
    return items
  }
}
