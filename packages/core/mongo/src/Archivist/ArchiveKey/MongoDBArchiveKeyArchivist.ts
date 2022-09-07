import { assertEx } from '@xylabs/assert'
import { XyoArchiveKey } from '@xyo-network/api'
import { ArchiveKeyArchivist } from '@xyo-network/archivist-model'
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
export class MongoDBArchiveKeyArchivist implements ArchiveKeyArchivist {
  constructor(@inject(MONGO_TYPES.ArchiveKeySdkMongo) protected readonly keys: BaseMongoSdk<XyoArchiveKey>) {}
  async find(filter: Filter<XyoArchiveKey>): Promise<XyoArchiveKey[]> {
    return (await (await this.keys.find(filter)).toArray()).map(fromDb)
  }
  async get(archives: string[]): Promise<XyoArchiveKey[]> {
    assertEx(archives.length === 1, 'Retrieval of multiple archives keys not supported')
    const archive = assertEx(archives.pop(), 'Missing archive')
    return (await (await this.keys.find({ archive })).toArray()).map(fromDb)
  }
  async insert(items: XyoArchiveKey[]): Promise<XyoArchiveKey[]> {
    assertEx(items.length === 1, 'Insertion of multiple archives keys not supported')
    const item = assertEx(items.pop(), 'Missing archive key')
    return await this.keys.useCollection(async (collection: Collection<XyoArchiveKey>) => {
      const result = await collection.insertOne({ ...item })
      if (result.acknowledged) {
        return [
          {
            archive: item.archive,
            created: result.insertedId.getTimestamp().getTime(),
            key: item.key,
          },
        ]
      } else {
        throw new Error('Insert Failed')
      }
    })
  }
}
