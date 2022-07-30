import { assertEx } from '@xylabs/sdk-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'

import { getMongoDBConfig } from './getMongoDBValues'

export const getBaseMongoSdk = <T>(collection: string) => {
  const env = getMongoDBConfig()
  return new BaseMongoSdk<T>({
    collection,
    dbConnectionString: env.MONGO_CONNECTION_STRING,
    dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
    dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
    dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
    dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
  })
}
