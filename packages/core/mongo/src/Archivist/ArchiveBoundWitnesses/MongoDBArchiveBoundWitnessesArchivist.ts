import { assertEx } from '@xylabs/sdk-js'
import { ArchiveBoundWitnessesArchivist, ArchiveBoundWitnessesArchivistId, XyoBoundWitnessFilterPredicate } from '@xyo-network/archivist-model'
import { EmptyObject, XyoBoundWitnessWithMeta, XyoPayloadWithPartialMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBArchiveBoundWitnessesArchivist implements ArchiveBoundWitnessesArchivist {
  constructor(@inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>) {}
  async find(query: XyoBoundWitnessFilterPredicate): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]> {
    return (await this.sdk.find(query)).limit(100).toArray()
  }
  async get(id: ArchiveBoundWitnessesArchivistId): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]> {
    const predicate = { _archive: assertEx(id.archive), _hash: assertEx(id.hash) }
    return (await this.sdk.find(predicate)).limit(1).toArray()
  }
  async insert(items: XyoBoundWitnessWithMeta[]): Promise<XyoBoundWitnessWithMeta[]> {
    // TODO: Remove payloads, calculate hash, remove id, etc.
    const result = await this.sdk.insertMany(items.map(removeId) as XyoBoundWitnessWithMeta[])
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting BoundWitnesses')
    }
    return items
  }
}
