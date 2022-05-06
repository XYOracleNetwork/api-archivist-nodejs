import { assertEx } from '@xylabs/sdk-js'

import { getMongoDBConfig } from '../../../../../lib'
import { UserMongoSdk } from './userSdk'

export const getUserMongoSdk = () => {
  const env = getMongoDBConfig()
  return new UserMongoSdk({
    collection: 'users',
    dbConnectionString: env.MONGO_CONNECTION_STRING,
    dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
    dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
    dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
    dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
  })
}
