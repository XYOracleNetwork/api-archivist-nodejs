import { ArchiveKeyArchivist } from '@xyo-network/archivist-model'
import { XyoArchiveKey } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Collection, Filter, WithId } from 'mongodb'

import { MONGO_TYPES } from '../../types'

const fromDb = (k: WithId<XyoArchiveKey>) => {
  return {
    archive: k.archive,
    created: k._id.getTimestamp().getTime(),
    key: k.key,
  }
}

@injectable()
class MongoDBArchiveKeyArchivist implements ArchiveKeyArchivist {
  constructor(@inject(MONGO_TYPES.ArchiveKeySdkMongo) protected readonly keys: BaseMongoSdk<XyoArchiveKey>) {}
  async find(filter: Filter<XyoArchiveKey>): Promise<XyoArchiveKey[]> {
    return (await (await this.keys.find(filter)).toArray()).map(fromDb)
  }
  async get(archive: string): Promise<XyoArchiveKey[]> {
    return (await (await this.keys.find({ archive })).toArray()).map(fromDb)
  }
  async insert(item: XyoArchiveKey): Promise<XyoArchiveKey> {
    return await this.keys.useCollection(async (collection: Collection<XyoArchiveKey>) => {
      const result = await collection.insertOne({ ...item })
      if (result.acknowledged) {
        return {
          archive: item.archive,
          created: result.insertedId.getTimestamp().getTime(),
          key: item.key,
        }
      } else {
        throw new Error('Insert Failed')
      }
    })
  }
}

exports = { MongoDBArchiveKeyArchivist }
