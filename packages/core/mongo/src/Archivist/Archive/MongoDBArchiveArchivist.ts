import 'reflect-metadata'

import { ArchiveArchivist, UpsertResult, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter, SortDirection, WithId } from 'mongodb'

import { MONGO_TYPES } from '../../types'

interface UpsertFilter {
  $and: [
    {
      archive: string
    },
    {
      user: string
    },
  ]
}

@injectable()
class MongoDBArchiveArchivist implements ArchiveArchivist {
  constructor(@inject(MONGO_TYPES.ArchiveSdkMongo) protected archives: BaseMongoSdk<Required<XyoArchive>>) {}

  async find(predicate: XyoPayloadFilterPredicate<XyoArchive>): Promise<Required<XyoArchive>[]> {
    const { archives, limit, offset, order, user } = predicate
    const parsedLimit = limit || 100
    const parsedOrder = order || 'desc'
    const sort: { [key: string]: SortDirection } = { $natural: parsedOrder === 'asc' ? 1 : -1 }
    const filter: Filter<Required<XyoArchive>> = {}
    if (archives?.length) filter.archive = { $in: archives }
    if (user) filter.user = user
    const skip = offset && offset > 0 ? offset : 0
    return (await this.archives.find(filter)).sort(sort).limit(parsedLimit).skip(skip).maxTimeMS(2000).toArray()
  }

  get(archive: string): Promise<Required<XyoArchive> | null> {
    return this.archives.findOne({ archive })
  }

  async insert(item: Required<XyoArchive>): Promise<WithId<Required<XyoArchive> & UpsertResult>> {
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

exports = { MongoDBArchiveArchivist }
