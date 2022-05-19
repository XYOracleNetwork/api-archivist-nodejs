import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { WithId } from 'mongodb'

import { getBaseMongoSdk, UpsertResult } from '../../../lib'
import { ArchiveRepository } from './ArchiveRepository'

interface UpsertFilter {
  $and: [
    {
      archive: string
    },
    {
      user: string
    }
  ]
}

export class MongoDBArchiveRepository implements ArchiveRepository {
  constructor(protected archives: BaseMongoSdk<XyoArchive> = getBaseMongoSdk<XyoArchive>('archives')) {}

  get(name: string): Promise<XyoArchive | null> {
    return this.archives.findOne({ archive: name })
  }

  async insert(item: XyoArchive): Promise<WithId<XyoArchive & UpsertResult>> {
    return await this.archives.useCollection(async (collection) => {
      const { archive, user } = item
      if (!archive || !user) {
        throw new Error('Invalid archive creation attempted. Archive and user are required.')
      }
      const filter: UpsertFilter = { $and: [{ archive }, { user }] }
      const result = await collection.findOneAndUpdate(filter, { $set: item }, { returnDocument: 'after', upsert: true })
      if (result.ok && result.value) {
        const updated = !!result?.lastErrorObject?.updatedExisting || false
        return { ...result.value, updated }
      }
      throw new Error('Insert Failed')
    })
  }
}
