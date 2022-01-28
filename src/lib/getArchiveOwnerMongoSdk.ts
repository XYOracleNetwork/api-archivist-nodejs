import { assertEx } from '@xylabs/sdk-js'
import { BaseMongoSdk, BaseMongoSdkConfig } from '@xyo-network/sdk-xyo-mongo-js'
import { Collection } from 'mongodb'

import { getMongoDBConfig } from './getMongoDBValues'

export const getArchiveOwnerMongoSdk = async () => {
  const env = await getMongoDBConfig()

  return new XyoArchiveOwnerMongoSdk({
    collection: 'archive_owner',
    dbConnectionString: env.MONGO_CONNECTION_STRING,
    dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
    dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
    dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
    dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
  })
}

interface IArchiveOwner {
  archive: string
  user: string
}

class XyoArchiveOwnerMongoSdk extends BaseMongoSdk<IArchiveOwner> {
  constructor(readonly config: BaseMongoSdkConfig, private readonly _maxTime = 2000) {
    super(config)
  }

  public async findByArchive(archive: string) {
    return await this.useCollection(async (collection: Collection<IArchiveOwner>) => {
      return await collection.findOne({ archive })
    })
  }
  public async findByUser(user: string) {
    return await this.useCollection(async (collection: Collection<IArchiveOwner>) => {
      return await collection.find({ user }).maxTimeMS(this._maxTime).toArray()
    })
  }

  public async insert(item: IArchiveOwner) {
    return await this.useCollection(async (collection: Collection<IArchiveOwner>) => {
      return await collection.insertOne({ ...item })
    })
  }
}
