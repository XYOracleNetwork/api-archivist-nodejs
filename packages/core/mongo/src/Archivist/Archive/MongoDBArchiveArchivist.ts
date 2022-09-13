import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import { XyoArchive } from '@xyo-network/api'
import { XyoArchivistQuery, XyoArchivistQuerySchema } from '@xyo-network/archivist'
import { ArchiveArchivist, UpsertResult, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoModuleQueryResult } from '@xyo-network/module'
import { Promisable, PromisableArray } from '@xyo-network/promisable'
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
export class MongoDBArchiveArchivist implements ArchiveArchivist {
  constructor(@inject(MONGO_TYPES.ArchiveSdkMongo) protected archives: BaseMongoSdk<Required<XyoArchive>>) {}

  public get address(): string {
    return 'TODO'
  }

  async find(predicate?: XyoPayloadFilterPredicate<XyoArchive>): Promise<Required<XyoArchive>[]> {
    if (!predicate) return []
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

  async get(archives: string[]): Promise<Array<Required<XyoArchive> | null>> {
    assertEx(archives.length === 1, 'Retrieval of multiple archives not supported')
    const archive = assertEx(archives.pop(), 'Missing archive')
    const result = await this.archives.findOne({ archive })
    return [result]
  }

  async insert(items: Required<XyoArchive>[]): Promise<WithId<Required<XyoArchive>> & UpsertResult> {
    return await this.archives.useCollection(async (collection) => {
      assertEx(items.length === 1, 'Insertion of multiple archives not supported')
      const item = assertEx(items.pop(), 'Missing archive')
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

  public queries(): XyoArchivistQuerySchema[] {
    return []
  }
  public query(_query: XyoArchivistQuery): Promisable<XyoModuleQueryResult> {
    throw new Error('')
  }
  public queryable(_schema: string): boolean {
    return false
  }
}
