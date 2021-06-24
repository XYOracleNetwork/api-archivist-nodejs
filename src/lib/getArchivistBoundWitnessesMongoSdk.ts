import { XyoArchivistBoundWitnessMongoSdk } from '@xyo-network/sdk-xyo-client-js'
import { assertEx } from '@xyo-network/sdk-xyo-js'
import dotenv from 'dotenv'

const getArchivistBoundWitnessesMongoSdk = (archive: string) => {
  dotenv.config()
  return new XyoArchivistBoundWitnessMongoSdk(
    {
      collection: 'bound_witnesses',
      dbDomain: assertEx(process.env.MONGO_DOMAIN, 'Missing Mongo Domain'),
      dbName: assertEx(process.env.MONGO_DATABASE, 'Missing Mongo Database'),
      dbPassword: assertEx(process.env.MONGO_PASSWORD, 'Missing Mongo Password'),
      dbUserName: assertEx(process.env.MONGO_USERNAME, 'Missing Mongo Username'),
    },
    archive
  )
}

export default getArchivistBoundWitnessesMongoSdk
