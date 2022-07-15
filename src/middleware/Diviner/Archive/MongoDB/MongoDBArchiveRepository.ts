import 'reflect-metadata'

import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter, WithId } from 'mongodb'

import { UpsertResult } from '../../../../model'
import { ArchiveRepository, EntityArchive } from '../ArchiveRepository'

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

@injectable()
export class MongoDBArchiveRepository implements ArchiveRepository {
  constructor(@inject(nameof<BaseMongoSdk<Required<XyoArchive>>>()) protected archives: BaseMongoSdk<Required<XyoArchive>>) {}

  async find(query: Filter<EntityArchive>): Promise<XyoArchive[]> {
    return (await this.archives.find(query)).toArray()
  }

  get(name: string): Promise<Required<XyoArchive> | null> {
    return this.archives.findOne({ archive: name })
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
