import { assertEx } from '@xylabs/sdk-js'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk, BaseMongoSdkConfig } from '@xyo-network/sdk-xyo-mongo-js'
import { Collection, WithId } from 'mongodb'

import { getMongoDBConfig } from './getMongoDBValues'

/** @deprecated use req.app.archiveRepository instead */
export const getArchivistArchiveMongoSdk = () => {
  const env = getMongoDBConfig()

  return new XyoArchiveMongoSdk({
    collection: 'archives',
    dbConnectionString: env.MONGO_CONNECTION_STRING,
    dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
    dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
    dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
    dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
  })
}

/** @deprecated use req.app.archiveRepository instead */
class XyoArchiveMongoSdk extends BaseMongoSdk<XyoArchive> {
  constructor(readonly config: BaseMongoSdkConfig, private readonly _maxTime = 2000) {
    super(config)
  }
  public async findByUser(user: string): Promise<WithId<XyoArchive>[]> {
    return await this.useCollection(async (collection: Collection<XyoArchive>) => {
      return await collection.find({ user }).maxTimeMS(this._maxTime).toArray()
    })
  }
}
