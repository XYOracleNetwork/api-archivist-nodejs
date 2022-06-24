import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { getBaseMongoSdk } from '../../../../lib'
import { AbstractBoundWitnessRepository } from '../../../../model'

export class MongoDBBoundWitnessRepository extends AbstractBoundWitnessRepository<XyoBoundWitness, string, Filter<XyoBoundWitness>> {
  constructor(protected sdk: BaseMongoSdk<XyoBoundWitness> = getBaseMongoSdk<XyoBoundWitness>('bound_witnesses')) {
    super()
  }
  async find(filter: Filter<XyoBoundWitness>): Promise<XyoBoundWitness[]> {
    return (await this.sdk.find(filter)).toArray()
  }
  async get(hash: string): Promise<XyoBoundWitness[]> {
    return (await this.sdk.find({ _hash: hash })).toArray()
  }
  async insert(items: XyoBoundWitness[]): Promise<XyoBoundWitness[]> {
    // TODO: Remove _id if present
    const result = await this.sdk.insertMany(items)
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting Payloads')
    }
    return items
  }
}
