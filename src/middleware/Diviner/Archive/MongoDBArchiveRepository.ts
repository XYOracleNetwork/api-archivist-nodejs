import { assertEx } from '@xylabs/sdk-js'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'

import { getMongoDBConfig } from '../../../lib'
import { XyoStoredPayload } from '../../../model'
import { ArchiveRepository } from './ArchiveRepository'
import { MongoDBArchivePayloadRepository } from './MongoDBArchivePayloadRepository'

export const getBaseSdk = <T>() => {
  const env = getMongoDBConfig()
  return new BaseMongoSdk<T>({
    collection: 'payloads',
    dbConnectionString: env.MONGO_CONNECTION_STRING,
    dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
    dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
    dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
    dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
  })
}

const getSdk = (): BaseMongoSdk<XyoStoredPayload<XyoArchive>> => getBaseSdk<XyoStoredPayload<XyoArchive>>()

export class MongoDBArchiveRepository implements ArchiveRepository {
  protected repo: MongoDBArchivePayloadRepository

  constructor(repo: BaseMongoSdk<XyoStoredPayload<XyoArchive>> = getSdk()) {
    this.repo = new MongoDBArchivePayloadRepository(repo)
  }

  async get(id: string): Promise<XyoArchive> {
    return (await this.repo.get(id))?.[0]
  }

  async insert(item: XyoArchive): Promise<XyoArchive> {
    return (await this.repo.insert([item]))?.[0]
  }
}
