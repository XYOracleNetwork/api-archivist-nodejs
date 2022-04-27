import { assertEx } from '@xylabs/sdk-js'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk, BaseMongoSdkConfig } from '@xyo-network/sdk-xyo-mongo-js'
import { Collection, WithId } from 'mongodb'

import { getMongoDBConfig } from './getMongoDBValues'
import { UpsertResult } from './UpsertResult'

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

export const getArchivistArchiveMongoSdk = async () => {
  const env = await getMongoDBConfig()

  return new XyoArchiveMongoSdk({
    collection: 'archives',
    dbConnectionString: env.MONGO_CONNECTION_STRING,
    dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
    dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
    dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
    dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
  })
}

class XyoArchiveMongoSdk extends BaseMongoSdk<XyoArchive> {
  constructor(readonly config: BaseMongoSdkConfig, private readonly _maxTime = 2000) {
    super(config)
  }

  public async findByArchive(archive: string): Promise<WithId<XyoArchive> | null> {
    return await this.useCollection(async (collection: Collection<XyoArchive>) => {
      return await collection.findOne({ archive })
    })
  }
  public async findByUser(user: string): Promise<WithId<XyoArchive>[]> {
    return await this.useCollection(async (collection: Collection<XyoArchive>) => {
      return await collection.find({ user }).maxTimeMS(this._maxTime).toArray()
    })
  }

  public async upsert(item: XyoArchive): Promise<WithId<XyoArchive & UpsertResult>> {
    return await this.useCollection(async (collection) => {
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
