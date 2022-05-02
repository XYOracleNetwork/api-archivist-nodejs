import { assertEx } from '@xylabs/sdk-js'
import { XyoArchivistBoundWitnessMongoSdk, XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'

import { getMongoDBConfig } from './getMongoDBValues'

export const getArchivistBoundWitnessesMongoSdk = (archive: string) => {
  const env = getMongoDBConfig()
  return new XyoArchivistBoundWitnessMongoSdk(
    {
      collection: 'bound_witnesses',
      dbConnectionString: env.MONGO_CONNECTION_STRING,
      dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
      dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
      dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
      dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
    },
    archive
  )
}

export const getArchivistAllBoundWitnessesMongoSdk = () => {
  const env = getMongoDBConfig()
  return new BaseMongoSdk<XyoBoundWitness>({
    collection: 'bound_witnesses',
    dbConnectionString: env.MONGO_CONNECTION_STRING,
    dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
    dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
    dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
    dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
  })
}
