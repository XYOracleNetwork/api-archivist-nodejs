import { assertEx } from '@xylabs/sdk-js'
import { XyoArchivistPayloadMongoSdk } from '@xyo-network/sdk-xyo-client-js'

import { getMongoDBConfig } from './getMongoDBConfig'

export const getArchivistPayloadMongoSdk = (archive: string) => {
  const env = getMongoDBConfig()

  return new XyoArchivistPayloadMongoSdk(
    {
      collection: 'payloads',
      dbConnectionString: env.MONGO_CONNECTION_STRING,
      dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
      dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
      dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
      dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
    },
    archive,
  )
}
