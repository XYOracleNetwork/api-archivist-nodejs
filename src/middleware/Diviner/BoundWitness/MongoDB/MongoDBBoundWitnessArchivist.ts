import { XyoBoundWitnessWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { getBaseMongoSdk } from '../../../../lib'
import { AbstractBoundWitnessArchivist } from '../../../../model'

export class MongoDBBoundWitnessArchivist extends AbstractBoundWitnessArchivist<XyoBoundWitnessWithMeta, string, Filter<XyoBoundWitnessWithMeta>> {
  constructor(protected sdk: BaseMongoSdk<XyoBoundWitnessWithMeta> = getBaseMongoSdk<XyoBoundWitnessWithMeta>('bound_witnesses')) {
    super()
  }
  async find(filter: Filter<XyoBoundWitnessWithMeta>): Promise<XyoBoundWitnessWithMeta[]> {
    return (await this.sdk.find(filter)).toArray()
  }
  async get(hash: string): Promise<XyoBoundWitnessWithMeta[]> {
    return (await this.sdk.find({ _hash: hash })).toArray()
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
