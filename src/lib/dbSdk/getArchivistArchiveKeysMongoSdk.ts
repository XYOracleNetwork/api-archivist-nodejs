import { assertEx } from '@xylabs/sdk-js'
import { XyoArchiveKey } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk, BaseMongoSdkConfig } from '@xyo-network/sdk-xyo-mongo-js'
import { Collection, ObjectId, WithId } from 'mongodb'

import { getMongoDBConfig } from './getMongoDBValues'

export const getArchivistArchiveKeysMongoSdk = async () => {
  const env = await getMongoDBConfig()

  return new XyoArchiveKeyMongoSdk({
    collection: 'archive_keys',
    dbConnectionString: env.MONGO_CONNECTION_STRING,
    dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
    dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
    dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
    dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
  })
}

class XyoArchiveKeyMongoSdk extends BaseMongoSdk<XyoArchiveKey> {
  constructor(readonly config: BaseMongoSdkConfig, private readonly _maxTime = 2000) {
    super(config)
  }

  public async findByArchive(archive: string): Promise<WithId<XyoArchiveKey>[]> {
    return await this.useCollection(async (collection: Collection<XyoArchiveKey>) => {
      return await collection.find({ archive }).toArray()
    })
  }
  public async insert(item: XyoArchiveKey): Promise<ObjectId> {
    return await this.useCollection(async (collection: Collection<XyoArchiveKey>) => {
      const result = await collection.insertOne({ ...item })
      if (result.acknowledged) {
        return result.insertedId
      } else {
        throw new Error('Insert Failed')
      }
    })
  }
}
